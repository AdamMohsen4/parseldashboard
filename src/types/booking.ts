
export interface BookingResponse {
  success: boolean;
  message?: string;
  shipmentId?: string;
  trackingCode?: string;
  labelUrl?: string;
  pickupTime?: string;
  totalPrice?: number;
  cancellationDeadline?: string;
  canBeCancelled?: boolean;
}

export interface AddressDetails {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
}

export interface BookingRequest {
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  pickup: AddressDetails;
  delivery: AddressDetails;
  carrier: {
    name: string;
    price: number;
  };
  deliverySpeed: string;
  includeCompliance: boolean;
  userId: string;
  customerType?: string;
  businessName?: string;
  vatNumber?: string;
  pickupSlotId: string;
}

export interface ApiKey {
  id: string;
  userId: string;
  apiKey: string;
  businessName: string;
  createdAt: string;
  lastUsedAt?: string;
  isActive: boolean;
}
