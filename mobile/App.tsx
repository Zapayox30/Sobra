import 'react-native-url-polyfill/auto'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './src/providers/auth-provider'
import { I18nProvider } from './src/providers/i18n-provider'
import RootNavigator from './src/navigation/RootNavigator'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 2 * 60_000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  )
}
