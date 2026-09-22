'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  translations,
  TranslationSchema,
  SUPPORTED_LANGUAGES,
  LanguageMeta,
  AGRI_PHRASE_DICTIONARY,
} from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
  isTranslatorOpen: boolean;
  setIsTranslatorOpen: (open: boolean) => void;
  supportedLanguages: LanguageMeta[];
  translatePhrase: (text: string, targetLang?: Language) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default language is English per user requirement
  const [language, setLanguageState] = useState<Language>('en');
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);

  // Load language preference from localStorage on mount - default is English
  useEffect(() => {
    try {
      const savedLang = (localStorage.getItem('kisan_selected_language') || localStorage.getItem('kisan_language')) as Language | null;
      if (savedLang && translations[savedLang]) {
        setLanguageState(savedLang);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = savedLang;
        }
      } else {
        setLanguageState('en');
        if (typeof document !== 'undefined') {
          document.documentElement.lang = 'en';
        }
      }
    } catch {
      setLanguageState('en');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    if (translations[lang]) {
      setLanguageState(lang);
      try {
        localStorage.setItem('kisan_selected_language', lang);
        localStorage.setItem('kisan_language', lang);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = lang;
        }
      } catch {
        // ignore
      }
    }
  };

  // Safe translation resolver with base fallback to English then selected language
  const t: TranslationSchema = {
    ...translations.en,
    ...(translations[language] || {}),
  };

  // Dynamic phrase translation helper
  const translatePhrase = (text: string, targetLang: Language = language): string => {
    if (!text) return '';
    const clean = text.trim().toLowerCase();

    // Check pre-computed agricultural dictionary
    for (const [key, mapping] of Object.entries(AGRI_PHRASE_DICTIONARY)) {
      if (clean === key || clean.includes(key) || key.includes(clean)) {
        if (mapping[targetLang]) {
          return mapping[targetLang];
        }
      }
    }

    // Direct translation matching across schema
    for (const langKey of Object.keys(translations) as Language[]) {
      const dict = translations[langKey];
      for (const [key, val] of Object.entries(dict)) {
        if (typeof val === 'string' && val.toLowerCase() === clean) {
          const targetVal = translations[targetLang]?.[key as keyof TranslationSchema];
          if (targetVal && typeof targetVal === 'string') {
            return targetVal;
          }
        }
      }
    }

    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isTranslatorOpen,
        setIsTranslatorOpen,
        supportedLanguages: SUPPORTED_LANGUAGES,
        translatePhrase,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
