import os
import json
import requests
import pandas as pd
from typing import List, Dict, Tuple, Optional
from supabase import create_client, Client
from dotenv import load_dotenv
from dataclasses import dataclass, asdict
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('shipment_processing.log')
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class Shipment:
    id: str
    tracking_code: str
    recipient_name: str
    recipient_address: str
    recipient_city: str
    recipient_postal_code: str
    recipient_country: str
    package_weight: float
    package_length: float
    package_width: float
    package_height: float
    special_instructions: str | None
    status: str
    created_at: datetime

    def to_jys_payload(self) -> Dict:
        """Convert shipment to JYS API payload format."""
        return {
            "tracking_code": self.tracking_code,
            "recipient": {
                "name": self.recipient_name,
                "address": self.recipient_address,
                "city": self.recipient_city,
                "postal_code": self.recipient_postal_code,
                "country": self.recipient_country
            },
            "package": {
                "weight": self.package_weight,
                "length": self.package_length,
                "width": self.package_width,
                "height": self.package_height,
                "special_instructions": self.special_instructions
            }
        }

@dataclass
class Business:
    id: str
    name: str
    vat_number: str
    address: str
    city: str
    postal_code: str
    country: str
    contact_person: str | None = None
    email: str | None = None
    phone: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

class JYSApiError(Exception):
    """Custom exception for JYS API-related errors."""
    pass

def get_supabase_client() -> Client:
    """Initialize Supabase client with environment variables."""
    load_dotenv()
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not supabase_key:
        raise ValueError("Missing Supabase credentials in environment variables")
    return create_client(supabase_url, supabase_key)

def fetch_business_shipments(supabase: Client, business_id: str) -> Tuple[Business, List[Shipment]]:
    """Fetch business details and all shipments."""
    business_response = supabase.table('high_volume_businesses').select('*').eq('id', business_id).execute()
    if not business_response.data:
        raise ValueError(f"Business with ID {business_id} not found")
    
    business_data = business_response.data[0]
    # Convert datetime strings to datetime objects if they exist
    if 'created_at' in business_data:
        business_data['created_at'] = datetime.fromisoformat(business_data['created_at'].replace('Z', '+00:00'))
    if 'updated_at' in business_data:
        business_data['updated_at'] = datetime.fromisoformat(business_data['updated_at'].replace('Z', '+00:00'))
    
    business = Business(**business_data)

    shipments_response = supabase.table('high_volume_shipments').select('*').eq('business_id', business_id).execute()
    shipments = []
    
    for s in shipments_response.data:
        # Create a filtered dict with only the fields that match Shipment's annotations
        shipment_data = {k: v for k, v in s.items() if k in Shipment.__annotations__}
        
        # Convert numeric fields
        shipment_data['package_weight'] = float(s['package_weight'])
        shipment_data['package_length'] = float(s['package_length'])
        shipment_data['package_width'] = float(s['package_width'])
        shipment_data['package_height'] = float(s['package_height'])
        
        # Convert datetime
        shipment_data['created_at'] = datetime.fromisoformat(s['created_at'].replace('Z', '+00:00'))
        
        shipments.append(Shipment(**shipment_data))
    
    return business, shipments

def send_to_jys_api(shipments: List[Shipment]) -> Tuple[List[str], List[str]]:
    """Send shipments to JYS API and get accepted/rejected lists."""
    load_dotenv()
    jys_api_url = os.getenv("JYS_API_URL")
    jys_api_key = os.getenv("JYS_API_KEY")
    
    if not jys_api_url or not jys_api_key:
        raise ValueError("Missing JYS API credentials in environment variables")
    
    # Prepare payload
    payload = {
        "shipments": [shipment.to_jys_payload() for shipment in shipments]
    }
    
    headers = {
        "Authorization": f"Bearer {jys_api_key}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(jys_api_url, json=payload, headers=headers)
        response.raise_for_status()
        
        result = response.json()
        if "accepted" not in result or "rejected" not in result:
            raise JYSApiError("Invalid response format from JYS API")
            
        return result["accepted"], result["rejected"]
        
    except requests.exceptions.RequestException as e:
        raise JYSApiError(f"Failed to communicate with JYS API: {str(e)}")
    except json.JSONDecodeError as e:
        raise JYSApiError(f"Failed to parse JYS API response: {str(e)}")

def update_shipment_carriers(supabase: Client, accepted_tracking_codes: List[str], rejected_tracking_codes: List[str]) -> None:
    """Update shipment carriers in the database."""
    try:
        # Update accepted shipments to JYS
        if accepted_tracking_codes:
            supabase.table('high_volume_shipments')\
                .update({"carrier": "JYS"})\
                .in_("tracking_code", accepted_tracking_codes)\
                .execute()
        
        # Update rejected shipments to Posti
        if rejected_tracking_codes:
            supabase.table('high_volume_shipments')\
                .update({"carrier": "Posti"})\
                .in_("tracking_code", rejected_tracking_codes)\
                .execute()
                
    except Exception as e:
        logger.error(f"Failed to update shipment carriers: {str(e)}")
        raise

def process_shipments(business_id: str):
    """Main function to process shipments for a business."""
    try:
        supabase = get_supabase_client()
        business, shipments = fetch_business_shipments(supabase, business_id)

        logger.info(f"\nProcessing shipments for business: {business.name}")
        logger.info(f"Total shipments: {len(shipments)}")

        # Send shipments to JYS API
        accepted_codes, rejected_codes = send_to_jys_api(shipments)
        
        # Log results
        logger.info(f"\nJYS API Results:")
        logger.info(f"Accepted shipments: {len(accepted_codes)}")
        logger.info(f"Rejected shipments: {len(rejected_codes)}")
        
        # Update shipment carriers in database
        update_shipment_carriers(supabase, accepted_codes, rejected_codes)
        
        # Group and display shipments by carrier
        shipment_df = pd.DataFrame([s.__dict__ for s in shipments])
        shipment_df['carrier'] = shipment_df['tracking_code'].apply(
            lambda code: "JYS" if code in accepted_codes else "Posti"
        )
        
        grouped_shipments = shipment_df.groupby("recipient_city")
        
        for location, group in grouped_shipments:
            logger.info(f"\n{location}:")
            sorted_group = group.sort_values("package_weight", ascending=False)
            
            for _, shipment in sorted_group.iterrows():
                logger.info(f"  - Tracking: {shipment['tracking_code']}")
                logger.info(f"    Carrier: {shipment['carrier']}")
                logger.info(f"    Weight: {shipment['package_weight']} kg")
                logger.info("")
                
    except Exception as e:
        logger.error(f"Error processing shipments: {str(e)}")
        raise

if __name__ == "__main__":
    business_id = input("Enter the business ID to process shipments: ")
    process_shipments(business_id)
