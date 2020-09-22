import { Menu } from '@dish/react-feather'
import { AbsoluteVStack, VStack } from '@dish/ui'
import { StatusBar } from 'expo-status-bar'
import { Provider } from 'overmind-react'
import React, { Suspense, useEffect, useState } from 'react'
import { LogBox, StyleSheet, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import AppAutocomplete from './AppAutocomplete'
import AppMap from './AppMap'
import { AppMapControlsOverlay } from './AppMapControlsOverlay'
import { AppMapControlsUnderlay } from './AppMapControlsUnderlay'
import { AppMenu } from './AppMenu'
import { AppRoot } from './AppRoot'
import { AppSmallDrawer } from './AppSmallDrawer'
import { AppStackView } from './AppStackView'
import { zIndexMapControls } from './constants'
import { useSafeArea } from './hooks/useSafeArea'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { PagesStackView } from './pages/PagesStackView'
import { om } from './state/om'
import { BlurView } from './views/BlurView'
import { LinkButton } from './views/ui/LinkButton'

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

              <NativeAppMenu />

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

const NativeAppMenu = () => {
  const safeArea = useSafeArea()
  const { color } = useSearchBarTheme()
  return (
    <AbsoluteVStack
      top={safeArea.top ? safeArea.top : 15}
      right={15}
      zIndex={zIndexMapControls + 1}
    >
      <VStack
        shadowColor="rgba(0,0,0,0.095)"
        shadowRadius={4}
        shadowOffset={{ height: 3, width: 0 }}
      >
        <BlurView borderRadius={24}>
          <LinkButton
            width={44}
            height={44}
            alignItems="center"
            justifyContent="center"
            borderRadius={100}
            noText
          >
            <Menu color={color} size={22} />
          </LinkButton>
        </BlurView>
      </VStack>
    </AbsoluteVStack>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1E2E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
