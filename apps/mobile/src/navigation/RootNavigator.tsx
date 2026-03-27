import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useSession } from '../providers/auth-provider'
import AuthNavigator from './AuthNavigator'
import MainNavigator from './MainNavigator'
import { LoadingScreen } from '../components/ui'
import { colors } from '../theme'

const Root = createNativeStackNavigator()

export default function RootNavigator() {
  const { session, isLoading } = useSession()

  if (isLoading) return <LoadingScreen />

  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.text,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          notification: colors.red,
        },
        fonts: {
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          bold: { fontFamily: 'System', fontWeight: '700' },
          heavy: { fontFamily: 'System', fontWeight: '800' },
        },
      }}
    >
      <Root.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <Root.Screen name="Main" component={MainNavigator} />
        ) : (
          <Root.Screen name="Auth" component={AuthNavigator} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  )
}
