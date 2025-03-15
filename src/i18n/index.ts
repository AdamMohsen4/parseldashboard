
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./translations/en.json";
import svTranslation from "./translations/sv.json";
import fiTranslation from "./translations/fi.json";

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: enTranslation,
    sv: svTranslation,
    fi: fiTranslation
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false // React already safes from XSS
  }
});

export default i18n;
