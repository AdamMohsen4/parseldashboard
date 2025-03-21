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

// Update BookingRequest to include the pickup and delivery address objects
export interface BookingRequest {
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  pickup: {
    name: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
    email: string;
  };
  delivery: {
    name: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
    email: string;
  };
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
