import { useEffect, useState } from 'react';

type Language = 'en' | 'ar';

const STORAGE_KEY = 'app-language';

class LanguageStore {
  private language: Language;
  private listeners: Set<(lang: Language) => void> = new Set();

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY) as Language;
    this.language = stored || 'en';
    this.updateHtmlDir();
  }

  getLanguage(): Language {
    return this.language;
  }

  setLanguage(lang: Language): void {
    this.language = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    this.updateHtmlDir();
    this.notify();
  }

  subscribe(listener: (lang: Language) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.language));
  }

  private updateHtmlDir(): void {
    document.documentElement.dir = this.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = this.language;
  }
}

export const languageStore = new LanguageStore();

export const useLanguage = (): [Language, (lang: Language) => void] => {
  const [language, setLanguageState] = useState<Language>(
    languageStore.getLanguage()
  );

  useEffect(() => {
    const unsubscribe = languageStore.subscribe((lang) => {
      setLanguageState(lang);
    });
    return unsubscribe;
  }, []);

  const setLanguage = (lang: Language) => {
    languageStore.setLanguage(lang);
  };

  return [language, setLanguage];
};
