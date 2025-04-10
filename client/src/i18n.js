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

// Определим язык: сначала из localStorage (если был выбран ранее), потом из браузера, потом 'en'
const savedLanguage = localStorage.getItem('i18nextLng');
const browserLanguage = navigator.language.split('-')[0]; // например, 'en' из 'en-US'
const defaultLanguage = savedLanguage || browserLanguage || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLanguage,
    fallbackLng: 'en', // если перевод на нужном языке отсутствует

    interpolation: {
      escapeValue: false 
    }
  });

// Слушаем изменения языка и сохраняем его в localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng); // сохраняем выбранный язык
});

export default i18n;