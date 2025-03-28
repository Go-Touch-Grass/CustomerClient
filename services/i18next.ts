import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import zh from '../locales/zh.json';

export const languageResources = {
  en: { translation: en },
  zh: { translation: zh },
};

i18next.use(initReactI18next).init({
    compatibilityJSON:'v3',
    lng: 'en', 
    fallbackLng: 'en',
    resources:languageResources,
    interpolation: {
        escapeValue: false, // React already safes from xss
      },
  });

export default i18next;
