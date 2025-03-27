
"""
Shipment aggregation module for batch processing.
This module is optimized to process shipments efficiently.
"""

from typing import List, Dict, Any, Optional
import time
import schedule

class Shipment:
    """Representation of a shipment with its physical properties."""
    
    def __init__(self, shipment_id: str, height: str, length: str, width: str, weight: str, destination: str):
        self.shipment_id = shipment_id
        self.height = float(height)
        self.width = float(width)
        self.length = float(length)
        self.weight = float(weight)
        self.destination = destination

    @property
    def volume(self) -> float:
        """Calculate volume in cubic meters."""
        return (self.height * self.width * self.length) / 1000000

    def __repr__(self) -> str:
        return f"Shipment {self.shipment_id}, volume = {self.volume:.2f}, weight = {self.weight}, destination = {self.destination}"


class Batch:
    """A batch of shipments grouped for efficient delivery."""
    
    def __init__(self, target_volume: float):
        self.target_volume = target_volume
        self.shipments: List[Shipment] = []
        self.current_volume = 0.0
        self.total_weight = 0.0
        self.destination: Optional[str] = None

    def can_add(self, shipment: Shipment) -> bool:
        """Check if shipment fits within remaining volume."""
        return self.current_volume + shipment.volume <= self.target_volume

    def add_shipment(self, shipment: Shipment) -> bool:
        """Add shipment to batch if there is enough space."""
        if self.can_add(shipment):
            self.shipments.append(shipment)
            self.current_volume += shipment.volume
            self.total_weight += shipment.weight
            if self.destination is None:
                self.destination = shipment.destination
            return True
        return False


def fetch_shipments() -> List[Shipment]:
    """Fetch shipment data from database.
    This is a placeholder - actual implementation would fetch from Supabase.
    
    Returns:
        List[Shipment]: List of shipments to process
    """
    # Import supabase client only when needed
    from .supabase_client import get_supabase_client
    
    supabase = get_supabase_client()
    response = supabase.table("booking").select("*").execute()
    
    if not response.data:
        print("No shipments found or error in fetching data.")
        return []

    return [
        Shipment(
            shipment["id"],  
            shipment["dimension_height"],  
            shipment["dimension_length"],
            shipment["dimension_width"],
            shipment["weight"],
            shipment["delivery_address"]
        )
        for shipment in response.data
    ]


def aggregate_shipments(shipments: List[Shipment], target_volume: float) -> List[Batch]:
    """Group shipments into batches based on volume."""
    batches: List[Batch] = []
    current_batch = Batch(target_volume)

    for shipment in shipments:
        if not current_batch.can_add(shipment):
            if current_batch.shipments:  # Only add non-empty batches
                batches.append(current_batch)
            current_batch = Batch(target_volume)

        current_batch.add_shipment(shipment)

    if current_batch.shipments:
        batches.append(current_batch)

    return batches


def process_shipments(target_volume: float = 3.0) -> None:
    """Process shipments into batches and store results."""
    shipments = fetch_shipments()
    if not shipments:
        print("No shipments to process")
        return

    batches = aggregate_shipments(shipments, target_volume)
    
    # Processing logic here
    for i, batch in enumerate(batches, start=1):
        print(f"Batch {i}: {len(batch.shipments)} shipments, volume={batch.current_volume:.2f}m³")


def start_scheduler(interval_minutes: int = 5) -> None:
    """Start the shipment processing scheduler."""
    schedule.every(interval_minutes).minutes.do(process_shipments)
    
    # Initial run
    process_shipments()
    
    try:
        while True:
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        print("Scheduler stopped")


if __name__ == "__main__":
    start_scheduler()
