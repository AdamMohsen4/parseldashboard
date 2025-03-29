import os
from typing import List, Dict, Tuple
from supabase import create_client, Client
from dotenv import load_dotenv
from dataclasses import dataclass
from datetime import datetime

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
    address: str
    city: str
    postal_code: str
    country: str

def get_supabase_client() -> Client:
    """Initialize Supabase client with environment variables."""
    load_dotenv()
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not supabase_key:
        raise ValueError("Missing Supabase credentials in environment variables")
    return create_client(supabase_url, supabase_key)

def fetch_business_shipments(supabase: Client, business_id: str) -> Tuple[Business, List[Shipment]]:
    """Fetch business details and all its shipments."""
    # Fetch business details
    business_response = supabase.table('high_volume_businesses').select('*').eq('id', business_id).execute()
    if not business_response.data:
        raise ValueError(f"Business with ID {business_id} not found")
    
    business_data = business_response.data[0]
    business = Business(
        id=business_data['id'],
        name=business_data['name'],
        address=business_data['address'],
        city=business_data['city'],
        postal_code=business_data['postal_code'],
        country=business_data['country']
    )

    # Fetch all shipments for this business
    shipments_response = supabase.table('high_volume_shipments').select('*').eq('business_id', business_id).execute()
    
    shipments = []
    for shipment_data in shipments_response.data:
        shipment = Shipment(
            id=shipment_data['id'],
            tracking_code=shipment_data['tracking_code'],
            recipient_name=shipment_data['recipient_name'],
            recipient_address=shipment_data['recipient_address'],
            recipient_city=shipment_data['recipient_city'],
            recipient_postal_code=shipment_data['recipient_postal_code'],
            recipient_country=shipment_data['recipient_country'],
            package_weight=float(shipment_data['package_weight']),
            package_length=float(shipment_data['package_length']),
            package_width=float(shipment_data['package_width']),
            package_height=float(shipment_data['package_height']),
            special_instructions=shipment_data.get('special_instructions'),
            status=shipment_data['status'],
            created_at=datetime.fromisoformat(shipment_data['created_at'].replace('Z', '+00:00'))
        )
        shipments.append(shipment)

    return business, shipments

def group_shipments_by_location(shipments: List[Shipment]) -> Dict[str, List[Shipment]]:
    """Group shipments by delivery location."""
    location_groups: Dict[str, List[Shipment]] = {}
    
    for shipment in shipments:
        # Create a location key combining city and country
        location_key = f"{shipment.recipient_city}, {shipment.recipient_country}"
        if location_key not in location_groups:
            location_groups[location_key] = []
        location_groups[location_key].append(shipment)
    
    return location_groups

def sort_shipments_by_weight(shipments: List[Shipment]) -> List[Shipment]:
    """Sort shipments by package weight in descending order."""
    return sorted(shipments, key=lambda x: x.package_weight, reverse=True)

def process_shipments(business_id: str):
    """Main function to process shipments for a business."""
    try:
        supabase = get_supabase_client()
        business, shipments = fetch_business_shipments(supabase, business_id)
        
        print(f"\nProcessing shipments for business: {business.name}")
        print(f"Total shipments: {len(shipments)}")
        
        # Group shipments by delivery location
        location_groups = group_shipments_by_location(shipments)
        
        print("\nShipments grouped by delivery location:")
        for location, location_shipments in location_groups.items():
            print(f"\n{location}:")
            # Sort shipments in each location by weight
            sorted_shipments = sort_shipments_by_weight(location_shipments)
            
            for shipment in sorted_shipments:
                print(f"  - Tracking: {shipment.tracking_code}")
                print(f"    Recipient: {shipment.recipient_name}")
                print(f"    Address: {shipment.recipient_address}")
                print(f"    Weight: {shipment.package_weight} kg")
                print(f"    Dimensions: {shipment.package_length}x{shipment.package_width}x{shipment.package_height} cm")
                if shipment.special_instructions:
                    print(f"    Special Instructions: {shipment.special_instructions}")
                print()

    except Exception as e:
        print(f"Error processing shipments: {str(e)}")

if __name__ == "__main__":
    # Example usage
    business_id = input("Enter the business ID to process shipments: ")
    process_shipments(business_id) 