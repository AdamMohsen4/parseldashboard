
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCountryFlag = (countryCode: string): string => {
  const flagEmoji = {
    "SE": "🇸🇪",
    "FI": "🇫🇮",
    "NO": "🇳🇴",
    "DK": "🇩🇰",
    "IS": "🇮🇸",
    // Add more country codes as needed
  };
  
  return flagEmoji[countryCode as keyof typeof flagEmoji] || "🌐";
}

export const getCountryName = (countryCode: string): string => {
  const countryNames = {
    "SE": "Sverige",
    "FI": "Finland",
    "NO": "Norge",
    "DK": "Danmark",
    "IS": "Island",
    // Add more country codes as needed
  };
  
  return countryNames[countryCode as keyof typeof countryNames] || countryCode;
}

export const formatPostalCode = (postalCode: string, countryCode: string): string => {
  // Different countries have different postal code formats
  // This is a simple implementation that can be expanded
  if (countryCode === "SE") {
    // Swedish postal codes are often formatted as "XXX XX"
    if (postalCode.length === 5 && !postalCode.includes(" ")) {
      return `${postalCode.substring(0, 3)} ${postalCode.substring(3)}`;
    }
  }
  
  return postalCode;
}
