import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { formatMoney as baseFormatMoney } from '../components/ui/utils'

interface PrivacyContextType {
  isHidden: boolean
  togglePrivacy: () => void
  formatMoney: (val: number | null | undefined) => string
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined)

const PRIVACY_KEY = '@sobra_privacy_mode'

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [isHidden, setIsHidden] = useState(false)

  // Cargar preferencia guardada
  useEffect(() => {
    AsyncStorage.getItem(PRIVACY_KEY).then(val => {
      if (val === 'true') setIsHidden(true)
    })
  }, [])

  const togglePrivacy = () => {
    setIsHidden(prev => {
      const next = !prev
      AsyncStorage.setItem(PRIVACY_KEY, next ? 'true' : 'false')
      return next
    })
  }

  // Wrapper para ocultar el dinero
  const formatMoney = (val: number | null | undefined) => {
    if (isHidden) return 'S/ ••••••'
    return baseFormatMoney(Number(val ?? 0))
  }

  return (
    <PrivacyContext.Provider value={{ isHidden, togglePrivacy, formatMoney }}>
      {children}
    </PrivacyContext.Provider>
  )
}

export function usePrivacy() {
  const context = useContext(PrivacyContext)
  if (!context) throw new Error('usePrivacy must be used within PrivacyProvider')
  return context
}
