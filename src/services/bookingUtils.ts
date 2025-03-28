<<<<<<< HEAD
export const calculateTotalPrice = (basePrice: number): number => {
  return basePrice;
=======

/**
 * Utility functions for booking operations
 */

/**
 * Calculates the total price including any applicable fees or discounts
 * @param basePrice - The base price of the shipment
 * @param discount - Optional discount to apply
 * @returns The final price
 */
export const calculateTotalPrice = (basePrice: number, discount = 0): number => {
  // Apply discount if provided
  const discountedPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
  // Round to 2 decimal places
  return Math.round(discountedPrice * 100) / 100;
>>>>>>> f8bbc6f5f1a499f699ffbdae29ee2a5d5c07e420
};

/**
 * Generates a unique shipment ID
 * @returns A string shipment ID
 */
export const generateShipmentId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 6);
  return `SHIP-${timestamp}${randomStr}`.toUpperCase();
};

/**
 * Generates a unique tracking code
 * @returns A string tracking code
 */
export const generateTrackingCode = (): string => {
  const timestamp = Date.now().toString(36).substring(0, 4);
  const randomNum = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return `EP${randomNum}FI`;
};
