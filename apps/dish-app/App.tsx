import { AbsoluteVStack, VStack } from '@dish/ui'
import { StatusBar } from 'expo-status-bar'
import { Provider } from 'overmind-react'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import AppAutocomplete from './shared/AppAutocomplete'
import AppMap from './shared/AppMap'
import { AppSmallDrawer } from './shared/AppSmallDrawer'
import { AppStackView } from './shared/AppStackView'
import { PagesStackView } from './shared/pages/PagesStackView'
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
          <AppMap />

          <AbsoluteVStack pointerEvents="none" fullscreen zIndex={1000}>
            <AppSmallDrawer>
              <AppStackView>
                {(props) => {
                  return <PagesStackView {...props} />
                }}
              </AppStackView>
            </AppSmallDrawer>
          </AbsoluteVStack>

          <AbsoluteVStack pointerEvents="none" fullscreen zIndex={1001}>
            <AppAutocomplete />
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
