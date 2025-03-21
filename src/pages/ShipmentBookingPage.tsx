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
  
  // Add cancellation window
  cancellationDeadline?: Date;
  
  // Sender details
  senderName?: string;
  senderEmail?: string;
  senderPhone?: string;
  
  // Recipient details
  recipientName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  
  // Additional fields
  additionalInstructions?: string;
}

export interface BookingResponse {
  success: boolean;
  shipmentId?: string;
  trackingCode?: string;
  labelUrl?: string;
  pickupTime?: string;
  totalPrice?: number;
  message?: string;
  
  // Add cancellation details
  cancellationDeadline?: string;
  canBeCancelled?: boolean;
}

// API Key interface for e-commerce integration
export interface ApiKey {
  id: string;
  userId: string;
  apiKey: string;
  businessName: string;
  createdAt: string;
  lastUsedAt?: string;
  isActive: boolean;
}

// E-commerce API request interface
export interface EcommerceShipmentRequest {
  apiKey: string;
  orderNumber: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  pickup: string;
  delivery: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  productDescription?: string;
  includeCompliance?: boolean;
}

// E-commerce API response interface
export interface EcommerceShipmentResponse {
  success: boolean;
  trackingCode?: string;
  labelUrl?: string;
  estimatedDelivery?: string;
  shipmentId?: string;
  message?: string;
}
