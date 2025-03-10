
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        book: 'Book Shipment',
        tracking: 'Tracking',
        compliance: 'Compliance',
        dashboard: 'Dashboard',
      },
      common: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
      },
    },
  },
  sv: {
    translation: {
      nav: {
        home: 'Hem',
        book: 'Boka Frakt',
        tracking: 'Spårning',
        compliance: 'Efterlevnad',
        dashboard: 'Översikt',
      },
      common: {
        signIn: 'Logga In',
        signUp: 'Registrera',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
