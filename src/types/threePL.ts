
export interface ThreePLRequest {
  // Company information
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  
  // Product details
  productType: string;
  productCategory: string;
  hazardousMaterials: boolean;
  specialHandlingNeeded: boolean;
  specialHandlingNotes?: string;
  
  // Storage requirements
  estimatedVolume: string;
  temperatureControlled: boolean;
  securityRequirements: string;
  
  // Fulfillment details
  averageOrdersPerMonth: string;
  peakSeasonMonths: string[];
  internationalShipping: boolean;
  
  // Additional information
  integrationNeeded: boolean;
  integrationSystems?: string[];
  customRequirements?: string;
  
  // User ID
  userId: string;
}

export interface ThreePLResponse {
  success: boolean;
  requestId?: string;
  message?: string;
}
