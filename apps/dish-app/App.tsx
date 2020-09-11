import { AbsoluteVStack, VStack } from '@dish/ui'
import { StatusBar } from 'expo-status-bar'
import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import HomePageHomePane from './shared/pages/home/HomePageHomePane'
import { HomePagePane } from './shared/pages/home/HomePagePane'
import { HomeSmallDrawer } from './shared/pages/home/HomeSmallDrawer'
import { HomeStackView } from './shared/pages/home/HomeStackView'
import { config } from './shared/state/om'
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
            <HomeStackView>
              {(props) => {
                return <HomePagePane {...props} />
              }}
            </HomeStackView>
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
