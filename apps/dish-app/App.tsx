import { AbsoluteVStack, VStack } from '@dish/ui'
import { StatusBar } from 'expo-status-bar'
import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { HomeSmallDrawer } from './shared/pages/home/HomeSmallDrawer'
import { config } from './shared/state/om'
import { DrawerNative } from './shared/views/DrawerNative'
import { MapNative } from './shared/views/MapNative'

async function start() {
  const om = createOvermind(config, {
    devtools: false,
    logProxies: true,
    hotReloading: process.env.NODE_ENV !== 'production',
  })
  window['om'] = om
  await om.initialized
  return om
}

export default function App() {
  const [overmind, setOvermind] = useState(null)

  useEffect(() => {
    start().then((om) => {
      setOvermind(om)
    })
  }, [])

  if (!overmind) {
    return null
  }

  return (
    <Provider value={overmind}>
      <View style={styles.container}>
        <MapNative />

        <AbsoluteVStack fullscreen zIndex={1000}>
          <HomeSmallDrawer>
            <VStack width={100} height={100} />
          </HomeSmallDrawer>
        </AbsoluteVStack>
        <StatusBar style="auto" />
      </View>
    </Provider>
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
