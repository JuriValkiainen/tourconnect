import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en.json';
import translationRU from './locales/ru.json';
import translationFI from './locales/fi.json';

const resources = {
  en: {
    translation: translationEN
  },
  fi: {
    translation: translationFI
  },
  ru: {
    translation: translationRU
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // язык по умолчанию
    fallbackLng: 'en', // если перевод не найден

    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;