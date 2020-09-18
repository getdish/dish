import { AbsoluteVStack, VStack } from '@dish/ui'
import { StatusBar } from 'expo-status-bar'
import { Provider } from 'overmind-react'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AppAutocomplete from './shared/AppAutocomplete'
import AppMap from './shared/AppMap'
import { AppRoot } from './shared/AppRoot'
import { AppSmallDrawer } from './shared/AppSmallDrawer'
import { AppStackView } from './shared/AppStackView'
import { PagesStackView } from './shared/pages/PagesStackView'
import { om } from './shared/state/om'

console.disableYellowBox = true

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
      <SafeAreaProvider>
        <Provider value={window['om']}>
          <AppRoot>
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
          </AppRoot>
        </Provider>
      </SafeAreaProvider>
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
