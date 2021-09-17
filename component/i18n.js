import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";
import translationEN from '../public/locales/en/translation.json';
import translationVI from '../public/locales/vi/translation.json';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
    en: {
        translation: translationEN
    },
    vi: {
        translation: translationVI
    },
};

i18n
    .use(detector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        fallbackLng: "en",
        keySeparator: false,
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;