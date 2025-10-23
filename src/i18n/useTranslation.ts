import { languageStore } from '@/store/languageStore';
import { translations, TranslationKey } from './translations';
import { useState, useEffect } from 'react';

export const useTranslation = () => {
  const [language, setLanguage] = useState(languageStore.getLanguage());

  useEffect(() => {
    const unsubscribe = languageStore.subscribe((lang) => {
      setLanguage(lang);
    });
    return unsubscribe;
  }, []);

  const t = (key: TranslationKey): string => {
    return translations[language][key];
  };

  return { t, language, setLanguage: (lang: 'en' | 'ar') => languageStore.setLanguage(lang) };
};
