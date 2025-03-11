
// These are common fields in all types of forms for 3PL service requests
export interface ThreePLRequestBase {
  // Company information
  userId: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  
  // Document URL for supporting documentation
  documentUrl?: string;
}

// The full 3PL service request with all details
export interface ThreePLRequest extends ThreePLRequestBase {
  // Product details (optional for simple form)
  productType?: string;
  productCategory?: string;
  hazardousMaterials?: boolean;
  specialHandlingNeeded?: boolean;
  specialHandlingNotes?: string;
  
  // Storage requirements (optional for simple form)
  estimatedVolume?: string;
  temperatureControlled?: boolean;
  securityRequirements?: string;
  
  // Fulfillment details (optional for simple form)
  averageOrdersPerMonth?: string;
  peakSeasonMonths?: string[];
  internationalShipping?: boolean;
  
  // Integration requirements (optional for simple form)
  integrationNeeded?: boolean;
  integrationSystems?: string[];
  
  // Additional information (optional)
  customRequirements?: string;
  
  // E-commerce specific fields
  ecommercePlatform?: string;
  ecommerceStoreUrl?: string;
  ecommerceSkuCount?: string;
  ecommerceOrderVolume?: string;
}

// Response from submitting a 3PL service request
export interface ThreePLResponse {
  success: boolean;
  requestId?: string;
  message?: string;
}

// Interface for e-commerce platform integration details
export interface EcommercePlatform {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
  apiDocUrl?: string;
}

// NEW: E-commerce integration button configuration
export interface EcommerceIntegrationButton {
  type: "script" | "link" | "button";
  variant?: "light" | "dark";
  size?: "small" | "medium" | "large";
  label?: string;
  includeIcon?: boolean;
}

// NEW: E-commerce integration script configuration
export interface EcommerceIntegrationScript {
  scriptUrl: string;
  apiKey: string;
  buttonConfig?: EcommerceIntegrationButton;
  callbackUrl?: string;
}

// NEW: E-commerce quick shipping request
export interface EcommerceShippingRequest {
  platform: string;
  storeId: string;
  apiKey: string;
  orderId: string;
  weight?: string;
  dimensions?: {
    length?: string;
    width?: string;
    height?: string;
  };
  pickup: string;
  delivery: string;
  customerType: "ecommerce";
  businessName: string;
}
