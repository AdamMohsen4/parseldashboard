
export const calculateTotalPrice = (basePrice: number, includeCompliance: boolean): number => {
  const complianceFee = includeCompliance ? 2 : 0;
  return basePrice + complianceFee;
};

export const calculateEstimatedDelivery = (deliverySpeed: string): string => {
  const date = new Date();
  
  // Add days based on delivery speed
  switch (deliverySpeed) {
    case 'standard':
      date.setDate(date.getDate() + 3);
      break;
    case 'express':
      date.setDate(date.getDate() + 1);
      break;
    default:
      date.setDate(date.getDate() + 5); // Default for economy
  }
  
  return date.toISOString().split('T')[0];
};

export const generateShipmentId = (): string => {
  return `SHIP-${Math.floor(Math.random() * 1000000)}`;
};

export const generateTrackingCode = (): string => {
  return `EP${Math.floor(Math.random() * 10000000)}FI`;
};
