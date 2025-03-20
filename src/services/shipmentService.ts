import { toast } from "@/components/ui/use-toast";

// Interfaces
export interface Shipment {
  id: string;
  userId: string;
  trackingCode: string;
  carrier: {
    name: string;
    price: number;
  };
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  pickup: string;
  delivery: string;
  deliverySpeed: string;
  includeCompliance: boolean;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'exception' | 'cancelled';
  createdAt: string;
  labelUrl?: string;
  pickupTime?: string;
  totalPrice: number;
  estimatedDelivery?: string;
  events: ShipmentEvent[];
}

export interface ShipmentEvent {
  date: string;
  location: string;
  status: string;
  description?: string;
}

// Mock database for shipments
class MockShipmentDatabase {
  private shipments: Shipment[] = [];
  private storage = window.localStorage;
  private DB_KEY = 'e_parsel_shipments';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const data = this.storage.getItem(this.DB_KEY);
    if (data) {
      try {
        this.shipments = JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse shipment data:', e);
        this.shipments = [];
      }
    }
  }

  private saveToStorage() {
    this.storage.setItem(this.DB_KEY, JSON.stringify(this.shipments));
  }

  public getAll(userId: string): Shipment[] {
    return this.shipments.filter(shipment => shipment.userId === userId);
  }

  public getById(id: string, userId: string): Shipment | undefined {
    return this.shipments.find(shipment => shipment.id === id && shipment.userId === userId);
  }

  public getByTrackingCode(trackingCode: string): Shipment | undefined {
    return this.shipments.find(shipment => shipment.trackingCode === trackingCode);
  }

  public add(shipment: Shipment): Shipment {
    this.shipments.push(shipment);
    this.saveToStorage();
    return shipment;
  }

  public update(shipment: Shipment): boolean {
    const index = this.shipments.findIndex(s => s.id === shipment.id && s.userId === shipment.userId);
    if (index !== -1) {
      this.shipments[index] = shipment;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public delete(id: string, userId: string): boolean {
    const index = this.shipments.findIndex(s => s.id === id && s.userId === userId);
    if (index !== -1) {
      this.shipments.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  public addEvent(shipmentId: string, event: ShipmentEvent): boolean {
    const shipment = this.shipments.find(s => s.id === shipmentId);
    if (shipment) {
      shipment.events.push(event);
      
      // Update status based on latest event
      switch (event.status) {
        case 'Picked up':
          shipment.status = 'picked_up';
          break;
        case 'In transit':
          shipment.status = 'in_transit';
          break;
        case 'Delivered':
          shipment.status = 'delivered';
          break;
        case 'Exception':
          shipment.status = 'exception';
          break;
        case 'Cancelled':
          shipment.status = 'cancelled';
          break;
        default:
          // Keep existing status if event doesn't match known statuses
          break;
      }
      
      this.saveToStorage();
      return true;
    }
    return false;
  }
}

// Create a singleton instance
const shipmentDB = new MockShipmentDatabase();

// Service functions
export const getShipments = async (userId: string): Promise<Shipment[]> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return shipmentDB.getAll(userId);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    toast({
      title: "Error Fetching Shipments",
      description: "Unable to retrieve your shipments. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

export const getShipmentById = async (id: string, userId: string): Promise<Shipment | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300));
    return shipmentDB.getById(id, userId) || null;
  } catch (error) {
    console.error('Error fetching shipment:', error);
    toast({
      title: "Error Fetching Shipment",
      description: "Unable to retrieve shipment details. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};

export const trackShipment = async (trackingCode: string): Promise<Shipment | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    return shipmentDB.getByTrackingCode(trackingCode) || null;
  } catch (error) {
    console.error('Error tracking shipment:', error);
    toast({
      title: "Tracking Error",
      description: "Unable to track this shipment. Please verify the tracking code.",
      variant: "destructive",
    });
    return null;
  }
};

export const updateShipmentStatus = async (
  id: string, 
  userId: string, 
  status: Shipment['status'], 
  event?: ShipmentEvent
): Promise<boolean> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const shipment = shipmentDB.getById(id, userId);
    if (!shipment) return false;
    
    shipment.status = status;
    
    if (event) {
      shipment.events.push(event);
    }
    
    return shipmentDB.update(shipment);
  } catch (error) {
    console.error('Error updating shipment status:', error);
    toast({
      title: "Update Failed",
      description: "Unable to update shipment status. Please try again.",
      variant: "destructive",
    });
    return false;
  }
};

export const saveShipment = async (shipment: Omit<Shipment, 'id' | 'createdAt' | 'events'> & { 
  userId: string 
}): Promise<Shipment | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newShipment: Shipment = {
      ...shipment,
      id: `SHIP-${Math.floor(Math.random() * 1000000)}`,
      createdAt: new Date().toISOString(),
      events: [
        {
          date: new Date().toISOString(),
          location: shipment.pickup,
          status: 'Shipment created',
          description: 'Shipment has been registered in our system'
        }
      ],
      status: 'pending'
    };
    
    shipmentDB.add(newShipment);
    
    return newShipment;
  } catch (error) {
    console.error('Error saving shipment:', error);
    toast({
      title: "Save Failed",
      description: "Unable to save shipment. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};
