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
        self.total_weight = 0  # Track total weight
        self.destination = None  # Destination (default to first shipment)

    def can_add(self, shipment):
        """Check if shipment fits within remaining volume."""
        return self.current_volume + shipment.volume <= 17.6
        

    def add_shipment(self, shipment):
        """Add shipment to batch if there is enough space."""
        if self.can_add(shipment):
            self.shipments.append(shipment)
            self.current_volume += shipment.volume
            self.total_weight += shipment.weight
            if self.destination is None:
                self.destination = shipment.destination  # Assign first shipment’s destination
            return True
        return False


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
            shipment["dimension_height"],  
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

    # Ensure no empty batches are included
    return [b for b in batches if b.current_volume > 0]


def send_batches_to_supabase(batches, target_volume):
    """Send batch data to Supabase if within ±5% of target volume."""
    batch_data = []  

    lower_bound = 0.95 * target_volume  # 95% of target
    upper_bound = 1.05 * target_volume  # 105% of target

    for batch_number, batch in enumerate(batches, start=1):
        if lower_bound <= batch.current_volume <= upper_bound:
            batch_info = {
                "volume": batch.current_volume,
                "destination": batch.destination,
                "batch_number": batch_number,
            }
            if batch.total_weight > 0:
                batch_info["weight"] = batch.total_weight

            batch_data.append(batch_info)

    if batch_data:
        response = supabase.table("batches").insert(batch_data).execute()
        if response.data:
            print(f"Successfully sent {len(batch_data)} batches to Supabase.")
        else:
            print("Error sending batches:", response.error)
    else:
        print("No batches met the volume criteria for sending.")


def process_and_display_shipments():
    """Fetch, process, display shipments, and send them to Supabase."""
    shipments = fetch_shipments()
    if shipments:
        target_volume = 5  
        batches = aggregate_shipments(shipments, target_volume)

        for i, batch in enumerate(batches, start=1):
            print(f"Batch {i}: {batch}")
            for shipment in batch.shipments:
                print(shipment)
            print()

        # Send batches to Supabase only if they are within ±5% of target volume
        send_batches_to_supabase(batches, target_volume)


if __name__ == "__main__":
    schedule.every(1).minutes.do(process_and_display_shipments)

    # Initial fetch and process
    process_and_display_shipments()

    while True:
        schedule.run_pending()
        time.sleep(1)  
