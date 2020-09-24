import { AbsoluteVStack } from '@dish/ui'
import { StatusBar } from 'expo-status-bar'
import { Provider } from 'overmind-react'
import React, { Suspense, useEffect, useState } from 'react'
import { LogBox, StyleSheet, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AppAutocomplete from './AppAutocomplete'
import AppMap from './AppMap'
import { AppMapControlsUnderlay } from './AppMapControlsUnderlay'
import { AppMenuFloating } from './AppMenuFloating'
import { AppRoot } from './AppRoot'
import { AppSmallDrawer } from './AppSmallDrawer'
import { AppStackView } from './AppStackView'
import { PagesStackView } from './pages/PagesStackView'
import { om } from './state/om'

LogBox.ignoreAllLogs(true)

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
      <StatusBar style="dark" />
      <SafeAreaProvider>
        <Provider value={window['om']}>
          <AppRoot>
            <View style={styles.container}>
              <Suspense fallback={null}>
                <AppMap />
              </Suspense>

              <AbsoluteVStack pointerEvents="none" fullscreen zIndex={1000}>
                <AppSmallDrawer>
                  <AppStackView>
                    {(props) => {
                      return <PagesStackView {...props} />
                    }}
                  </AppStackView>
                </AppSmallDrawer>
              </AbsoluteVStack>

              <Suspense fallback={null}>
                <AppMapControlsUnderlay />
                {/* <AppMapControlsOverlay /> */}
              </Suspense>

              <AppMenuFloating />

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
    backgroundColor: '#D7E6F5', // map bg
    alignItems: 'center',
    justifyContent: 'center',
  },
})
