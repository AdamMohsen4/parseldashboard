# Implements the core aggregation logic (e.g. a greedy algorithm or bin packing mechanism) that groups shipments into pools

class Shipment:
    def __init__(self, shipment_id, volume, weight, destination):
        self.shipment_id = shipment_id
        self.volume = volume
        self.weight = weight
        self.destination = destination
   
    # Define a string representation of the object for debugging
    def __repr__(self):
        return f"Shipment {self.shipment_id}, volume = {self.volume}, weight = {self.weight}"
    
    
class Batch:
    def __init__(self, target_volume):
        self.target_volume = target_volume
        self.shipments = []
        self.current_volume = 0

    def can_add(self, shipment):
        return self.current_volume + shipment.volume <= self.target_volume
         
    def add_shipment(self, shipment):
        if self.can_add(shipment):
            self.shipments.append(shipment)
            self.current_volume += shipment.volume
            return True
        return False
         
    # Define a string representation of the object for debugging.
    def __repr__(self):
        return f"Batch(volume = {self.current_volume}/{self.target_volume})"
         
def aggregate_shipments(shipments, target_volume):
    batches = []
    current_batch = Batch(target_volume)
     
    for shipment in shipments:
        if not current_batch.can_add(shipment):
            batches.append(current_batch)
            current_batch = Batch(target_volume)
        # Add the shipment whether it's a new batch or fits in the current one.
        current_batch.add_shipment(shipment)
            
    if current_batch.shipments:
        batches.append(current_batch)

    return batches

if __name__ == "__main__":
    shipments = [
        Shipment(1, 10, 5, "A"),
        Shipment(2, 20, 10, "B"),
        Shipment(3, 15, 8, "A"),
        Shipment(4, 30, 15, "C"),
        Shipment(5, 25, 12, "B"),
    ]
    
    target_volume = 50  # Example target for testing
    batches = aggregate_shipments(shipments, target_volume)
    
    for batch in batches:
        print(batch)
        for shipment in batch.shipments:
            print(shipment)
        print()  # Print a blank line as a separator
