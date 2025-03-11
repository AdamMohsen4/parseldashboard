
export type CustomerType = "business" | "private" | "ecommerce";

export interface BookingRequest {
  // Package details
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  
  // Addresses
  pickup: string;
  delivery: string;
  
  // Carrier details
  carrier: {
    name: string;
    price: number;
  };
  
  // Options
  deliverySpeed: string;
  includeCompliance: boolean;
  
  // Pickup slot (optional)
  pickupSlotId?: string;
  
  // User ID
  userId: string;
  
  // Customer type data
  customerType?: CustomerType;
  businessName?: string;
  vatNumber?: string;
  
  // E-commerce integration fields (optional)
  ecommerceOrderId?: string;
  ecommercePlatform?: string;
  ecommerceStoreId?: string;
  callbackUrl?: string;
}

export interface BookingResponse {
  success: boolean;
  shipmentId?: string;
  trackingCode?: string;
  labelUrl?: string;
  pickupTime?: string;
  totalPrice?: number;
  message?: string;
  
  // E-commerce callback data
  ecommerceOrderStatus?: "shipping" | "label_created";
  ecommerceTrackingUrl?: string;
}
