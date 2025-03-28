export interface ShipmentData {
  recipientName: string;
  recipientAddress: string;
  recipientCity: string;
  recipientPostalCode: string;
  recipientCountry: string;
  packageWeight: number;
  packageLength: number;
  packageWidth: number;
  packageHeight: number;
  specialInstructions?: string;
}

export interface HighVolumeShipment {
  businessInfo: {
    name: string;
    vatNumber: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  shipments: ShipmentData[];
  totalPackages: number;
  totalWeight: number;
  estimatedCost: number;
} 