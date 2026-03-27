import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { AppState, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import { colors, fontSize, spacing, borderRadius } from '../theme'

interface SecurityProviderProps {
  children: React.ReactNode
}

const SecurityContext = createContext({})

export function SecurityProvider({ children }: SecurityProviderProps) {
  const [isLocked, setIsLocked] = useState(true) // Inicialmente bloqueado
  const [hasBiometrics, setHasBiometrics] = useState(false)
  const [authenticating, setAuthenticating] = useState(true)
  const appState = useRef(AppState.currentState)

  // 1. Verificar si el dispositivo soporta biometría
  useEffect(() => {
    async function checkCapabilities() {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      setHasBiometrics(hasHardware && isEnrolled)
      if (hasHardware && isEnrolled) {
        authenticate()
      } else {
        setIsLocked(false)
        setAuthenticating(false)
      }
    }
    checkCapabilities()
  }, [])

  // 2. Escuchar cuando la app se va al fondo (Background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // Si la app pasa al background, bloqueamos inmediatamente
      if (
        appState.current.match(/active/) &&
        (nextAppState === 'inactive' || nextAppState === 'background')
      ) {
        if (hasBiometrics) {
          setIsLocked(true)
        }
      }

      // Si la app vuelve a estar activa, disparamos autenticación (si está bloqueada)
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (isLocked && hasBiometrics && !authenticating) {
          authenticate()
        }
      }

      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [hasBiometrics, isLocked, authenticating])

  const authenticate = async () => {
    if (authenticating) return
    setAuthenticating(true)
    
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Desbloquea SOBRA para continuar',
        fallbackLabel: 'Usar código',
        disableDeviceFallback: false,
        cancelLabel: 'Cancelar',
      })
      
      if (result.success) {
        setIsLocked(false)
      } else {
        // En caso de que el usuario haya cancelado o fallado repetidas veces
        setIsLocked(true)
      }
    } catch (e) {
      console.warn(e)
    } finally {
      setAuthenticating(false)
    }
  }

  return (
    <SecurityContext.Provider value={{}}>
      {/* 
        Si está bloqueado, renderizamos la aplicación detrás (children) pero 
        le ponemos un View negro absoluto encima que bloquea toda interacción.
      */}
      {children}
      
      {isLocked && hasBiometrics && (
        <View style={styles.lockScreen}>
          <Text style={styles.lockEmoji}>🔒</Text>
          <Text style={styles.lockTitle}>Sobra está bloqueado</Text>
          <Text style={styles.lockDesc}>Protegiendo tu información financiera.</Text>
          
          <TouchableOpacity 
            style={styles.unlockBtn} 
            onPress={authenticate} 
            disabled={authenticating}
            activeOpacity={0.8}
          >
            {authenticating ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={styles.unlockBtnText}>Desbloquear con Biometría</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SecurityContext.Provider>
  )
}

const styles = StyleSheet.create({
  lockScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background, // Opaco y oscuro
    zIndex: 99999, // Arriba de TODO
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  lockEmoji: {
    fontSize: 64,
    marginBottom: spacing.xl,
  },
  lockTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  lockDesc: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing['4xl'],
  },
  unlockBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    borderRadius: borderRadius.xl,
    width: '100%',
    alignItems: 'center',
  },
  unlockBtnText: {
    color: colors.primaryForeground,
    fontSize: fontSize.base,
    fontWeight: '700',
  },
})
