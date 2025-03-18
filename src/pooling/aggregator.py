from supabase_client import supabase
import time
import schedule

class Shipment:
    def __init__(self, shipment_id, height, length, width, weight, destination):
        self.shipment_id = shipment_id
        self.height = float(height)  # Ensure numeric conversion
        self.width = float(width)
        self.length = float(length)
        self.weight = float(weight)  # Weight should also be numeric
        self.destination = destination

    @property
    def volume(self):
        """Calculate volume dynamically."""
        return (self.height * self.width * self.length) / 1000000
    
    def __repr__(self):
        return f"Shipment {self.shipment_id}, volume = {self.volume}, weight = {self.weight}, destination = {self.destination}"


class Batch:
    def __init__(self, target_volume):
        self.target_volume = target_volume
        self.shipments = []
        self.current_volume = 0

    def can_add(self, shipment):
        """Check if shipment fits within remaining volume."""
        return self.current_volume + shipment.volume <= self.target_volume

    def add_shipment(self, shipment):
        """Add shipment to batch if there is enough space."""
        if self.can_add(shipment):
            self.shipments.append(shipment)
            self.current_volume += shipment.volume
            return True
        return False

    def __repr__(self):
        return f"Batch(volume = {self.current_volume}/{self.target_volume}, shipments = {len(self.shipments)})"


def fetch_shipments():
    """Fetch shipment data from Supabase."""
    response = supabase.table("booking").select("*").execute()

    if not response.data:
        print("No shipments found or error in fetching data.")
        return []

    # Convert fetched data into Shipment objects
    shipments = [
        Shipment(
            shipment["id"],  
            shipment["dimension_height"],  # Fixed typo in key name
            shipment["dimension_length"],
            shipment["dimension_width"],
            shipment["weight"],
            shipment["delivery_address"]
        )
        for shipment in response.data
    ]
    return shipments


def aggregate_shipments(shipments, target_volume):
    """Group shipments into batches based on volume."""
    batches = []
    current_batch = Batch(target_volume)
     
    for shipment in shipments:
        if not current_batch.can_add(shipment):
            batches.append(current_batch)
            current_batch = Batch(target_volume)
            
        current_batch.add_shipment(shipment)
            
    if current_batch.shipments:
        batches.append(current_batch)

    batches = [b for b in batches if b.current_volume > 0]

    return batches


def process_and_display_shipments():
    """Fetch and process shipments, then display results."""
    shipments = fetch_shipments()
    if shipments:
        target_volume = 5
        batches = aggregate_shipments(shipments, target_volume)

        i = 1
        for batch in batches:
            print(f"Batch {i}: {batch}")
            i += 1
            for shipment in batch.shipments:
                print(shipment)
            print()


if __name__ == "__main__":
    # Schedule the task to run every 10 minutes
    schedule.every(1).minutes.do(process_and_display_shipments)

    # Initial fetch and process
    process_and_display_shipments()

    # Run the scheduled tasks
    while True:
        schedule.run_pending()  # Run the scheduled tasks
        time.sleep(1)  # Sleep for a short while before checking again
