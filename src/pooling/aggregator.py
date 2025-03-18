# Implements the core aggregation logic (e.g. a greedy algorithm or bin packing mechanism) that groups shipments into pools

class Shipment:
    def __init__(self, shipment_id, volume, weight, desitionation):
         self.shipment_id = shipment_id
         self.volume = volume
         self.weight = weight
         self.destination = destination
   
   # Define a string representation of the object for debugging
    def __repr__(self):
         return f"Shipment {self.shipment_id}, volume = {self.volume}, weight = {self.weight}"