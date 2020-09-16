import { AbsoluteVStack, VStack } from '@dish/ui'
import { StatusBar } from 'expo-status-bar'
import { Provider } from 'overmind-react'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import HomeAutocomplete from './shared/pages/home/HomeAutocomplete'
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
    <>
      <StatusBar style="auto" />
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

          <AbsoluteVStack pointerEvents="none" fullscreen zIndex={1001}>
            <HomeAutocomplete />
          </AbsoluteVStack>
        </View>
      </Provider>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
