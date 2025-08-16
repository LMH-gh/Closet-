
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { en } from '../locales/en';
import { zh } from '../locales/zh';
import { fr } from '../locales/fr';
import { de } from '../locales/de';
import { ja } from '../locales/ja';
import { ko } from '../locales/ko';
import { ru } from '../locales/ru';

export type Locale = 'en' | 'zh' | 'fr' | 'de' | 'ja' | 'ko' | 'ru';

export const locales: Record<Locale, any> = { en, zh, fr, de, ja, ko, ru };

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let result: any = locales[locale];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult: any = locales['en'];
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
            if (fallbackResult === undefined) {
                return key; // Return key if not found in English either
            }
        }
        return fallbackResult as string;
      }
    }
    return result as string;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};