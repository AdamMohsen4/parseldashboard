
import { generateMockRates, mockShipments, mockTrackingPoints, pickupSlots } from '../utils/mockData';
import { 
  Shipment,
  ParcelDimensions,
  Location,
  DeliveryUrgency,
  ShippingRate,
  TrackingPoint 
} from '../types';

// Mock API service
export const API = {
  // Fetch shipping rates based on parcel info
  getRates: async (
    dimensions: ParcelDimensions,
    pickup: Location,
    delivery: Location,
    urgency: DeliveryUrgency
  ): Promise<ShippingRate[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock rates
    return generateMockRates(dimensions.weight, urgency);
  },
  
  // Book a shipment
  bookShipment: async (
    dimensions: ParcelDimensions,
    pickup: Location,
    delivery: Location, 
    rate: ShippingRate,
    pickupSlotId?: string
  ): Promise<Shipment> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Create a new mock shipment
    const newShipment: Shipment = {
      id: `ship-${Math.floor(Math.random() * 1000000)}`,
      carrier: rate.carrier,
      trackingCode: `${rate.carrier.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 1000000000)}`,
      status: 'booked',
      pickupLocation: pickup,
      deliveryLocation: delivery,
      dimensions,
      price: rate.price,
      labelUrl: '#',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // If pickup slot is provided, add pickup time
    if (pickupSlotId) {
      const slot = pickupSlots.find(s => s.id === pickupSlotId);
      if (slot) {
        const [startTime] = slot.timeWindow.split(' - ');
        newShipment.pickupTime = `${slot.date}T${startTime}:00Z`;
      }
    }
    
    return newShipment;
  },
  
  // Get all shipments
  getShipments: async (): Promise<Shipment[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockShipments;
  },
  
  // Get a single shipment by ID
  getShipment: async (id: string): Promise<Shipment | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockShipments.find(s => s.id === id) || null;
  },
  
  // Get tracking points for a shipment
  getTrackingPoints: async (trackingCode: string): Promise<TrackingPoint[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Find the shipment by tracking code
    const shipment = mockShipments.find(s => s.trackingCode === trackingCode);
    
    if (!shipment) {
      return [];
    }
    
    // Return tracking points for this shipment
    return mockTrackingPoints.filter(tp => tp.shipmentId === shipment.id);
  },
  
  // Get available pickup slots
  getPickupSlots: async (): Promise<typeof pickupSlots> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return pickupSlots;
  },
  
  // Generate shipment label
  generateLabel: async (shipmentId: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real application, this would return a URL to a PDF
    return '#';
  },
  
  // Generate carbon report
  generateCarbonReport: async (shipmentId: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real application, this would return a URL to a PDF
    return '#';
  }
};
