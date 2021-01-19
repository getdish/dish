import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export function PlatformSpecificProvider({ children }: any) {
  return <SafeAreaProvider>{children}</SafeAreaProvider>
}
