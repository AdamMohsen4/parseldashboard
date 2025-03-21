
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

export const getCountryDialCode = (countryCode: string): string => {
  const dialCodes = {
    "SE": "+46",
    "FI": "+358",
    "NO": "+47",
    "DK": "+45",
    "IS": "+354",
  };
  
  return dialCodes[countryCode as keyof typeof dialCodes] || "";
}

export const translateLabel = (key: string, language: string = 'en'): string => {
  const translations: Record<string, Record<string, string>> = {
    // Steps
    "basicDetails": {
      "en": "Basic details",
      "sv": "Grundläggande detaljer",
      "fi": "Perustiedot"
    },
    "address": {
      "en": "Address",
      "sv": "Adress",
      "fi": "Osoite"
    },
    "contentAndReferences": {
      "en": "Content and references",
      "sv": "Innehåll och referens",
      "fi": "Sisältö ja viitteet"
    },
    
    // From/To sections
    "from": {
      "en": "From",
      "sv": "Från",
      "fi": "Lähettäjä"
    },
    "to": {
      "en": "To",
      "sv": "Till",
      "fi": "Vastaanottaja"
    },
    
    // Address form fields
    "sender": {
      "en": "Sender",
      "sv": "Avsändare",
      "fi": "Lähettäjä"
    },
    "recipient": {
      "en": "Recipient",
      "sv": "Mottagare",
      "fi": "Vastaanottaja"
    },
    "streetAddress": {
      "en": "Street Address",
      "sv": "Gatuadress",
      "fi": "Katuosoite"
    },
    "streetAddress2": {
      "en": "Street Address 2",
      "sv": "Gatuadress 2",
      "fi": "Katuosoite 2"
    },
    "postalCode": {
      "en": "Postal Code",
      "sv": "Postnummer",
      "fi": "Postinumero"
    },
    "city": {
      "en": "City",
      "sv": "Ort",
      "fi": "Kaupunki"
    },
    "country": {
      "en": "Country",
      "sv": "Land",
      "fi": "Maa"
    },
    "phoneNumber": {
      "en": "Phone Number",
      "sv": "Mobil-/Telefonnummer",
      "fi": "Puhelinnumero"
    },
    "email": {
      "en": "Email",
      "sv": "Epost",
      "fi": "Sähköposti"
    },
    "payerEmail": {
      "en": "Payer's Email",
      "sv": "Betalarens e-postadress",
      "fi": "Maksajan sähköposti"
    },
    "personalId": {
      "en": "Personal ID Number",
      "sv": "Personnummer",
      "fi": "Henkilötunnus"
    },
    
    // Buttons & Summary
    "back": {
      "en": "Back",
      "sv": "Tillbaka",
      "fi": "Takaisin"
    },
    "continue": {
      "en": "Continue",
      "sv": "Fortsätt",
      "fi": "Jatka"
    },
    "summary": {
      "en": "Summary",
      "sv": "Sammanfattning",
      "fi": "Yhteenveto"
    },
    "package": {
      "en": "Package",
      "sv": "Paket",
      "fi": "Paketti"
    },
    "service": {
      "en": "Service",
      "sv": "Välj tjänst",
      "fi": "Palvelu"
    },
    "additionalInfo": {
      "en": "Additional Information/Transportation Instructions",
      "sv": "Tilläggsuppgifter/transportanvisningar",
      "fi": "Lisätietoja/kuljetusohjeet"
    },
    "recipientWillNotBeNotified": {
      "en": "Recipient will not be notified by email",
      "sv": "Mottagaren får ej avisering om e-post saknas",
      "fi": "Vastaanottajalle ei ilmoiteta, jos sähköpostia ei ole"
    },
    
    // Pricing
    "priceExcludingVAT": {
      "en": "Price excluding VAT",
      "sv": "Pris moms 0%",
      "fi": "Hinta ilman ALV"
    },
    "vat": {
      "en": "VAT 25%",
      "sv": "MOMS 25%",
      "fi": "ALV 25%"
    },
    "totalPrice": {
      "en": "Total price",
      "sv": "Totalpris",
      "fi": "Kokonaishinta"
    },
  };
  
  return translations[key]?.[language] || key;
}
