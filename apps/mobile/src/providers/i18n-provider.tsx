import React, { useState, useCallback } from 'react'
import { I18nContext, translations, type Locale } from '../lib/i18n'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('es')

  const value = {
    locale,
    setLocale: useCallback((l: Locale) => setLocale(l), []),
    t: translations[locale],
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}
