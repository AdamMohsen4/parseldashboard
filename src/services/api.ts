
import { 
  Shipment,
  ParcelDimensions,
  Location,
  DeliveryUrgency,
  ShippingRate,
  TrackingPoint 
} from '../types';

// Mock data
const generateMockRates = (weight: number, urgency: DeliveryUrgency): ShippingRate[] => {
  const basePrice = weight * 2.5;
  const options = [
    { carrier: 'FastShip', multiplier: 1.0, days: urgency === 'standard' ? '3-5' : '1-2' },
    { carrier: 'GlobalPost', multiplier: 0.8, days: urgency === 'standard' ? '5-7' : '2-3' },
    { carrier: 'ExpressCargo', multiplier: 1.2, days: urgency === 'standard' ? '2-4' : '1' },
  ];
  
  return options.map(option => ({
    id: `rate-${Math.random().toString(36).substring(2, 9)}`,
    carrier: option.carrier,
    price: parseFloat((basePrice * option.multiplier).toFixed(2)),
    estimatedDays: option.days,
    availability: Math.random() > 0.1,
  }));
};

const pickupSlots = [
  { id: 'slot-1', date: '2023-11-01', timeWindow: '09:00 - 12:00', available: true },
  { id: 'slot-2', date: '2023-11-01', timeWindow: '13:00 - 16:00', available: true },
  { id: 'slot-3', date: '2023-11-02', timeWindow: '09:00 - 12:00', available: false },
  { id: 'slot-4', date: '2023-11-02', timeWindow: '13:00 - 16:00', available: true },
  { id: 'slot-5', date: '2023-11-03', timeWindow: '09:00 - 12:00', available: true },
];

const mockShipments: Shipment[] = [
  {
    id: 'ship-123456',
    carrier: 'FastShip',
    trackingCode: 'FS123456789',
    status: 'in_transit',
    pickupLocation: {
      address: '123 Main St, New York, NY',
      coordinates: { lat: 40.7128, lng: -74.006 }
    },
    deliveryLocation: {
      address: '456 Market St, San Francisco, CA',
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    dimensions: {
      width: 30,
      height: 20,
      length: 25,
      weight: 5,
    },
    price: 45.99,
    labelUrl: '#',
    createdAt: '2023-10-20T14:30:00Z',
    updatedAt: '2023-10-22T09:15:00Z',
    estimatedDelivery: '2023-10-25T00:00:00Z',
  },
  {
    id: 'ship-789012',
    carrier: 'GlobalPost',
    trackingCode: 'GP987654321',
    status: 'delivered',
    pickupLocation: {
      address: '789 Oak Dr, Chicago, IL',
      coordinates: { lat: 41.8781, lng: -87.6298 }
    },
    deliveryLocation: {
      address: '101 Pine St, Seattle, WA',
      coordinates: { lat: 47.6062, lng: -122.3321 }
    },
    dimensions: {
      width: 15,
      height: 10,
      length: 15,
      weight: 2,
    },
    price: 28.50,
    labelUrl: '#',
    createdAt: '2023-10-15T10:00:00Z',
    updatedAt: '2023-10-18T14:20:00Z',
    deliveredAt: '2023-10-18T14:15:00Z',
  }
];

const mockTrackingPoints: TrackingPoint[] = [
  {
    id: 'track-1',
    shipmentId: 'ship-123456',
    status: 'picked_up',
    location: {
      address: '123 Main St, New York, NY',
      coordinates: { lat: 40.7128, lng: -74.006 }
    },
    timestamp: '2023-10-21T09:30:00Z',
    description: 'Package picked up',
  },
  {
    id: 'track-2',
    shipmentId: 'ship-123456',
    status: 'in_transit',
    location: {
      address: 'Distribution Center, Columbus, OH',
      coordinates: { lat: 39.9612, lng: -82.9988 }
    },
    timestamp: '2023-10-22T06:45:00Z',
    description: 'Package in transit',
  },
  {
    id: 'track-3',
    shipmentId: 'ship-789012',
    status: 'picked_up',
    location: {
      address: '789 Oak Dr, Chicago, IL',
      coordinates: { lat: 41.8781, lng: -87.6298 }
    },
    timestamp: '2023-10-16T11:20:00Z',
    description: 'Package picked up',
  },
  {
    id: 'track-4',
    shipmentId: 'ship-789012',
    status: 'in_transit',
    location: {
      address: 'Transfer Station, Minneapolis, MN',
      coordinates: { lat: 44.9778, lng: -93.2650 }
    },
    timestamp: '2023-10-17T08:15:00Z',
    description: 'Package in transit',
  },
  {
    id: 'track-5',
    shipmentId: 'ship-789012',
    status: 'delivered',
    location: {
      address: '101 Pine St, Seattle, WA',
      coordinates: { lat: 47.6062, lng: -122.3321 }
    },
    timestamp: '2023-10-18T14:15:00Z',
    description: 'Package delivered',
  },
];

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
