
export const calculateTotalPrice = (basePrice: number): number => {
  return basePrice;
};

export const generateShipmentId = (): string => {
  return `SHIP-${Math.floor(Math.random() * 1000000)}`;
};

export const generateTrackingCode = (): string => {
  return `EP${Math.floor(Math.random() * 10000000)}FI`;
};
