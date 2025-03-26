export interface BookingResponse {
  success: boolean;
  message?: string;
  shipmentId?: string;
  trackingCode?: string;
  labelUrl?: string;
  pickupTime?: string;
  totalPrice?: number;
  cancellationDeadline?: string;
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
  userId: string;
  customerType?: string;
  pickupSlotId: string;
  poolingEnabled?: boolean;
  deliveryDate?: string;
  paymentMethod?: 'swish' | 'ebanking' | 'card';
  paymentDetails?: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardholderName?: string;
    swishNumber?: string;
    bankName?: string;
  };
  termsAccepted?: boolean;
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
