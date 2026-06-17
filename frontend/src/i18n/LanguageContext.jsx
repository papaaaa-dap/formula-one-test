import { createContext, useContext, useState, useCallback } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  const t = useCallback((key) => {
    return translations[lang]?.[key] || translations.en[key] || key
  }, [lang])

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'en' ? 'id' : 'en'))
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
