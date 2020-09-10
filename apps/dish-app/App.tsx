import { AbsoluteVStack, VStack } from '@dish/ui'
import { SplashScreen } from 'expo'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Constants } from 'react-native-unimodules'

import { MapNative } from './shared/views/MapNative'

console.log(Constants.systemFonts)

export default function App() {
  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <View style={styles.container}>
      <MapNative />

      {/* <AbsoluteVStack>
        <DrawerNative>
        <VStack width={100} height={100} />
        </DrawerNative>
      </AbsoluteVStack> */}
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
