'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Locale, translations, Translations } from './translations'

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es')

  // Cargar idioma guardado en localStorage al iniciar
  useEffect(() => {
    const savedLocale = localStorage.getItem('sobra-locale') as Locale | null
    let initialLocale: Locale = 'es'
    
    if (savedLocale && (savedLocale === 'es' || savedLocale === 'en')) {
      initialLocale = savedLocale
    } else {
      // Detectar idioma del navegador
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'en') {
        initialLocale = 'en'
      }
    }
    
    setLocaleState(initialLocale)
    document.documentElement.lang = initialLocale
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('sobra-locale', newLocale)
    // Actualizar atributo lang en HTML
    document.documentElement.lang = newLocale
  }

  const value = {
    locale,
    setLocale,
    t: translations[locale],
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

