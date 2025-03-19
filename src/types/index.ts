
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Location {
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface ParcelDimensions {
  weight: number;
  length: number;
  width: number;
  height: number;
}

export interface ShippingRate {
  id: string;
  carrier: string;
  price: number;
  eta: number;
  originalPrice: number;
}

export interface Shipment {
  id: string;
  trackingCode?: string;
  carrier: string;
  status: 'pending' | 'booked' | 'in-transit' | 'delivered';
  pickupLocation: Location;
  deliveryLocation: Location;
  dimensions: ParcelDimensions;
  pickupTime?: string;
  deliveryTime?: string;
  price: number;
  labelUrl?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
}

export interface TrackingPoint {
  id: string;
  shipmentId: string;
  status: string;
  location: string;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  description?: string;
}

export interface ComplianceReport {
  id: string;
  shipmentId: string;
  type: 'carbon' | 'eld';
  data: any;
  createdAt: string;
}

export type DeliveryUrgency = 1 | 3 | 5;
