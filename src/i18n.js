import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import ar from "./locales/ar/translation.json";
import he from "./locales/he/translation.json";

const RTL_LANGS = new Set(["ar", "he"]);

function applyDocumentDirection(lng) {
    const lang = lng?.split("-")?.[0] || "en";
    const isRtl = RTL_LANGS.has(lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", isRtl);
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ar: { translation: ar },
            he: { translation: he }
        },
        fallbackLng: "en",
        supportedLngs: ["en", "ar", "he"],
        interpolation: { escapeValue: false },

        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"]
        }
    });

// بدل:
// applyDocumentDirection(i18n.language);
// i18n.on("languageChanged", (lng) => applyDocumentDirection(lng));

// اعمل:
i18n.on("initialized", (options) => {
    applyDocumentDirection(i18n.language);
});

i18n.on("languageChanged", (lng) => {
    applyDocumentDirection(lng);
});

export default i18n;
