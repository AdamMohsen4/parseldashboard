
from supabase_client import supabase
import time
import schedule
import math
from collections import defaultdict
from datetime import datetime, timedelta

class Shipment:
    def __init__(self, shipment_id, height, length, width, weight, destination, priority=1, created_at=None):
        self.shipment_id = shipment_id
        self.height = float(height)  # Ensure numeric conversion
        self.width = float(width)
        self.length = float(length)
        self.weight = float(weight)  # Weight should also be numeric
        self.destination = destination
        self.priority = priority  # 1 = normal, 2 = high, 3 = urgent
        self.created_at = created_at or datetime.now().isoformat()
        self._volume = None  # Cache the volume calculation

    @property
    def volume(self):
        """Calculate volume dynamically with caching."""
        if self._volume is None:
            self._volume = (self.height * self.width * self.length) / 1000000
        return self._volume
    
    @property
    def density(self):
        """Calculate density (weight/volume ratio)."""
        return self.weight / self.volume if self.volume > 0 else 0
    
    @property
    def value_score(self):
        """Calculate a value score based on volume, weight and priority."""
        # Higher priority shipments get a boost
        return (self.volume * 0.7 + self.weight * 0.3) * self.priority
    
    def get_destination_zone(self):
        """Extract a simplified zone from the destination for grouping."""
        # This is a simple implementation - could be enhanced with geolocation services
        if not self.destination:
            return "unknown"
        parts = self.destination.split(',')
        if len(parts) >= 2:
            return parts[-2].strip()  # Usually the city or region
        return self.destination
    
    def __repr__(self):
        return f"Shipment {self.shipment_id}, volume = {self.volume:.4f}, weight = {self.weight}, destination = {self.destination}, priority = {self.priority}"


class Batch:
    def __init__(self, target_volume, target_weight=None, name=None):
        self.name = name or f"Batch-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
        self.target_volume = target_volume
        self.target_weight = target_weight or (target_volume * 250)  # Default weight capacity
        self.shipments = []
        self.current_volume = 0
        self.current_weight = 0
        self.destination_zones = set()
        self._efficiency = None
        self.created_at = datetime.now()
    
    @property
    def fill_ratio(self):
        """Calculate how full the batch is (volume-wise)."""
        return self.current_volume / self.target_volume if self.target_volume > 0 else 0
    
    @property
    def weight_ratio(self):
        """Calculate weight fill ratio."""
        return self.current_weight / self.target_weight if self.target_weight > 0 else 0
    
    @property 
    def efficiency(self):
        """Calculate batch efficiency score."""
        if self._efficiency is not None:
            return self._efficiency
            
        if not self.shipments:
            return 0
            
        # Consider both volume and weight utilization
        volume_efficiency = self.fill_ratio
        weight_efficiency = self.weight_ratio
        
        # Consider zone concentration (fewer zones = better)
        zone_penalty = len(self.destination_zones) / len(self.shipments) if self.shipments else 1
        
        # Balance between volume efficiency and zone consolidation
        self._efficiency = (volume_efficiency * 0.6 + weight_efficiency * 0.4) * (1 - zone_penalty * 0.2)
        return self._efficiency
    
    def can_add(self, shipment):
        """Check if shipment fits within remaining capacity."""
        volume_check = self.current_volume + shipment.volume <= self.target_volume
        weight_check = self.current_weight + shipment.weight <= self.target_weight
        return volume_check and weight_check

    def add_shipment(self, shipment):
        """Add shipment to batch if there is enough space."""
        if self.can_add(shipment):
            self.shipments.append(shipment)
            self.current_volume += shipment.volume
            self.current_weight += shipment.weight
            self.destination_zones.add(shipment.get_destination_zone())
            self._efficiency = None  # Reset cached efficiency
            return True
        return False
    
    def estimated_delivery_window(self):
        """Estimate delivery timeframe based on batch characteristics."""
        base_days = 3  # Base delivery time
        
        # More zones or higher volume may increase delivery time
        zone_factor = len(self.destination_zones) * 0.5
        volume_factor = self.fill_ratio * 2
        
        total_days = math.ceil(base_days + zone_factor + volume_factor)
        
        delivery_date = datetime.now() + timedelta(days=total_days)
        return delivery_date.strftime("%Y-%m-%d")

    def __repr__(self):
        return f"Batch {self.name} (volume = {self.current_volume:.2f}/{self.target_volume}, weight = {self.current_weight:.2f}/{self.target_weight}, efficiency = {self.efficiency:.2f}, shipments = {len(self.shipments)}, zones = {len(self.destination_zones)})"


def fetch_shipments():
    """Fetch shipment data from Supabase."""
    try:
        response = supabase.table("booking").select("*").execute()

        if not response.data:
            print("No shipments found or error in fetching data.")
            return []

        # Convert fetched data into Shipment objects
        shipments = []
        for shipment in response.data:
            # Determine priority based on delivery_speed if available
            priority = 1  # Default priority
            if "delivery_speed" in shipment:
                speed = shipment.get("delivery_speed", "standard")
                if speed == "express":
                    priority = 2
                elif speed == "priority":
                    priority = 3
                    
            # Extract destination properly
            destination = shipment.get("delivery_address", "")
            
            shipments.append(
                Shipment(
                    shipment["id"],  
                    shipment.get("dimension_height", 10),
                    shipment.get("dimension_length", 10),
                    shipment.get("dimension_width", 10),
                    shipment.get("weight", 1),
                    destination,
                    priority,
                    shipment.get("created_at")
                )
            )
        return shipments
    except Exception as e:
        print(f"Error fetching shipments: {e}")
        return []


def group_by_destination(shipments):
    """Group shipments by destination zone."""
    destination_groups = defaultdict(list)
    
    for shipment in shipments:
        zone = shipment.get_destination_zone()
        destination_groups[zone].append(shipment)
    
    return destination_groups


def aggregate_shipments(shipments, target_volume, target_weight=None):
    """Group shipments into batches based on volume, weight and destination."""
    if not shipments:
        return []
        
    # Sort shipments by priority (highest first) and then by value score
    shipments.sort(key=lambda s: (s.priority, s.value_score), reverse=True)
    
    # Group shipments by general destination
    destination_groups = group_by_destination(shipments)
    
    # Sort destination groups by total volume (largest first) to process bigger groups first
    sorted_destinations = sorted(
        destination_groups.items(), 
        key=lambda x: sum(s.volume for s in x[1]), 
        reverse=True
    )
    
    batches = []
    remaining_shipments = []
    
    # First pass: Try to create zone-optimized batches
    for zone, zone_shipments in sorted_destinations:
        if len(zone_shipments) >= 3:  # Only create zone-specific batches if enough shipments
            current_batch = Batch(target_volume, target_weight, f"Zone-{zone}")
            
            for shipment in zone_shipments:
                if not current_batch.add_shipment(shipment):
                    remaining_shipments.append(shipment)
                    
            if current_batch.shipments:
                batches.append(current_batch)
        else:
            # Too few shipments for this zone, add them to remaining
            remaining_shipments.extend(zone_shipments)
    
    # Second pass: Process remaining shipments with general batches
    current_batch = Batch(target_volume, target_weight)
    
    for shipment in remaining_shipments:
        if not current_batch.add_shipment(shipment):
            # Current batch is full, start a new one
            if current_batch.shipments:
                batches.append(current_batch)
            current_batch = Batch(target_volume, target_weight)
            current_batch.add_shipment(shipment)
            
    # Add the last batch if it has shipments
    if current_batch.shipments:
        batches.append(current_batch)
    
    # Sort batches by efficiency for reporting
    batches.sort(key=lambda b: b.efficiency, reverse=True)
    
    return batches


def save_batch_to_supabase(batch):
    """Save a completed batch to Supabase for tracking."""
    try:
        batch_data = {
            "name": batch.name,
            "volume": batch.current_volume,
            "weight": batch.current_weight,
            "shipment_count": len(batch.shipments),
            "zone_count": len(batch.destination_zones),
            "efficiency": batch.efficiency,
            "estimated_delivery": batch.estimated_delivery_window(),
            "shipment_ids": [s.shipment_id for s in batch.shipments],
            "created_at": batch.created_at.isoformat()
        }
        
        result = supabase.table("batches").insert(batch_data).execute()
        if result.data:
            print(f"Successfully saved batch {batch.name} to database")
            return True
        return False
    except Exception as e:
        print(f"Error saving batch to database: {e}")
        return False


def process_and_display_shipments():
    """Fetch and process shipments, then display results."""
    shipments = fetch_shipments()
    if not shipments:
        print("No shipments available for processing")
        return
        
    print(f"Processing {len(shipments)} shipments for batching...")
    
    # Configure batch parameters
    target_volume = 5  # cubic meters
    target_weight = 1000  # kg
    
    batches = aggregate_shipments(shipments, target_volume, target_weight)
    
    if not batches:
        print("No batches could be created from available shipments")
        return
    
    # Display batching results
    print(f"\n🚚 Created {len(batches)} optimized batches:")
    
    total_shipments = sum(len(batch.shipments) for batch in batches)
    overall_efficiency = sum(batch.efficiency for batch in batches) / len(batches)
    
    print(f"Overall efficiency: {overall_efficiency:.2f}")
    print(f"Total shipments allocated: {total_shipments}/{len(shipments)}")
    
    for i, batch in enumerate(batches, 1):
        print(f"\nBatch {i}: {batch}")
        print(f"Estimated delivery: {batch.estimated_delivery_window()}")
        print(f"Efficiency score: {batch.efficiency:.2f}")
        print(f"Zones: {', '.join(batch.destination_zones)}")
        print("Shipments:")
        for shipment in batch.shipments:
            print(f"  - {shipment}")
    
    # Save batches to database for tracking
    for batch in batches:
        save_batch_to_supabase(batch)


if __name__ == "__main__":
    # Schedule the task to run every 10 minutes
    schedule.every(10).minutes.do(process_and_display_shipments)

    # Initial fetch and process
    process_and_display_shipments()

    # Run the scheduled tasks
    while True:
        schedule.run_pending()  # Run the scheduled tasks
        time.sleep(1)  # Sleep for a short while before checking again
