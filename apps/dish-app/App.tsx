import { AbsoluteVStack } from '@dish/ui'
import { StatusBar } from 'expo-status-bar'
import { Provider } from 'overmind-react'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import HomeMap from './shared/pages/home/HomeMap'
import { HomePagePane } from './shared/pages/home/HomePagePane'
import { HomeSmallDrawer } from './shared/pages/home/HomeSmallDrawer'
import { HomeStackView } from './shared/pages/home/HomeStackView'
import { om } from './shared/state/om'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    om.initialized.then(() => {
      setLoaded(true)
    })
  }, [])

  if (!loaded) {
    return null
  }

  return (
    <Provider value={window['om']}>
      <View style={styles.container}>
        <HomeMap />

        <AbsoluteVStack pointerEvents="none" fullscreen zIndex={1000}>
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
    backgroundColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
