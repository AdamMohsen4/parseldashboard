import os
import pandas as pd
from typing import List, Dict, Tuple
from supabase import create_client, Client
from dotenv import load_dotenv
from dataclasses import dataclass
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

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

def get_supabase_client() -> Client:
    """Initialize Supabase client with environment variables."""
    load_dotenv()
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not supabase_key:
        raise ValueError("Missing Supabase credentials in environment variables")
    return create_client(supabase_url, supabase_key)

JYS_REGIONS = {"Helsinki", "Tampere", "Espoo"}  # Expand as needed

def assign_carrier(shipment: Shipment) -> str:
    """Assigns the most optimal carrier based on delivery regions."""
    return "JYS" if shipment.recipient_city in JYS_REGIONS else "Posti"

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

def assign_carriers_bulk(shipments: List[Shipment]) -> pd.DataFrame:
    """Assign carriers efficiently using Pandas."""
    df = pd.DataFrame([s.__dict__ for s in shipments])
    df['carrier'] = df['recipient_city'].apply(lambda city: "JYS" if city in JYS_REGIONS else "Posti")
    return df

def sort_shipments_parallel(shipments: List[Dict]) -> List[Dict]:
    """Sorts shipments in parallel for better performance on large datasets."""
    with ThreadPoolExecutor() as executor:
        sorted_shipments = executor.map(lambda x: sorted(x, key=lambda s: s['package_weight'], reverse=True), [shipments])
    return list(sorted_shipments)[0]

def process_shipments(business_id: str):
    """Main function to process shipments for a business."""
    try:
        supabase = get_supabase_client()
        business, shipments = fetch_business_shipments(supabase, business_id)

        print(f"\nProcessing shipments for business: {business.name}")
        print(f"Total shipments: {len(shipments)}")

        # Assign carriers in bulk
        shipment_df = assign_carriers_bulk(shipments)
        grouped_shipments = shipment_df.groupby("recipient_city")
        
        for location, group in grouped_shipments:
            print(f"\n{location}:")
            sorted_group = sort_shipments_parallel(group.to_dict(orient='records'))
            
            for shipment in sorted_group:
                print(f"  - Tracking: {shipment['tracking_code']}")
                print(f"    Carrier: {shipment['carrier']}")
                print(f"    Weight: {shipment['package_weight']} kg")
                print()
    except Exception as e:
        print(f"Error processing shipments: {str(e)}")

if __name__ == "__main__":
    business_id = input("Enter the business ID to process shipments: ")
    process_shipments(business_id)
