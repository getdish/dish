import { DebugHUD } from './DebugHUD'
import { Radar } from './Radar'
import { App } from './app/App'
import { homeStore } from './app/homeStore'
import { useUserStore, userStore } from './app/userStore'
import { showRadar } from './constants/constants'
import { initialHomeState } from './constants/initialHomeState'
import { tagDefaultAutocomplete, tagFilters, tagLenses } from './constants/localTags'
import './globals'
import { addTagsToCache } from './helpers/allTags'
import { DRoutesTable, router, routes } from './router'
import config from './tamagui.config'
import { useHydrateCache } from '@dish/graph'
import { configureAssertHelpers } from '@dish/helpers'
import { ProvideRouter } from '@dish/router'
import { PortalProvider, TamaguiProvider, Toast, isWeb } from '@dish/ui'
import { configureUseStore } from '@dish/use-store'
import { Inter_400Regular, Inter_800ExtraBold } from '@expo-google-fonts/inter'
import { DrawerProvider } from '@tamagui/drawer'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Appearance, useColorScheme } from 'react-native'

console.log('Appearance', Appearance.getColorScheme())

declare module '@dish/router' {
  interface RoutesTable extends DRoutesTable {}
}

let isStarted = false
// let startPromise

async function start() {
  if (isStarted) {
    return
  }

  if (process.env.TAMAGUI_TARGET === 'native') {
    // todo move to hook in app.native https://docs.expo.dev/guides/using-custom-fonts/
    await Font.loadAsync({
      Cardinal: require('../assets/fonts/cardinal-trial.otf'),
      Inter: Inter_400Regular,
      InterBold: Inter_800ExtraBold,
    })
  }

  await new Promise<void>((res) => {
    addTagsToCache([...tagDefaultAutocomplete, ...tagFilters, ...tagLenses])
    userStore.checkForExistingLogin()

    // if coming in fresh, redirect to our initial region
    if (router.curPage.name === 'home' && !router.curPage.params.region) {
      router.navigate({
        name: 'homeRegion',
        params: {
          region: initialHomeState.region,
        },
        replace: true,
      })
    }

    router.onRouteChange((item) => {
      homeStore.handleRouteChange(item)
      // startPromise = null
      res()
    })
  })

  isStarted = true
}

configureUseStore({
  logLevel: process.env.LOG_LEVEL ? 'info' : 'error',
})

if (process.env.NODE_ENV === 'development') {
  configureAssertHelpers({
    onAssertFail: (why) => {
      if (why) {
        Toast.error(why)
      } else {
        console.groupCollapsed('Assertion exited')
        console.trace()
        console.groupEnd()
      }
    },
  })
}

const cacheSnapshot = global.__CACHE_SNAPSHOT

export function Root() {
  const [isLoaded, setIsLoaded] = useState(false)
  const userStore = useUserStore()
  const colorScheme = useColorScheme()

  if (cacheSnapshot) {
    useHydrateCache({
      cacheSnapshot,
    })
  }

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync()
    }
  }, [isLoaded])

  useEffect(() => {
    start().then(() => {
      setIsLoaded(true)
    })
  }, [])

  const defaultTheme =
    (!userStore.theme || userStore.theme === 'auto' ? colorScheme : userStore.theme) ??
    colorScheme ??
    'dark'

  return (
    <TamaguiProvider config={config} defaultTheme={defaultTheme}>
      <ProvideRouter routes={routes}>
        <PortalProvider>
          <Suspense fallback={null}>
            {isLoaded ? (
              <>
                <App />
                {process.env.NODE_ENV === 'development' && <DebugHUD />}
                {isWeb && <div id="before-bottom-sheet-temp" />}
              </>
            ) : null}
          </Suspense>
        </PortalProvider>
        {showRadar && <Radar />}
      </ProvideRouter>
    </TamaguiProvider>
  )
}

// can be used by ssr in the future to load app
// export function RootSuspenseLoad(props: any) {
//   if (!isStarted && !startPromise) {
//     startPromise = start()
//   }
//   if (startPromise) {
//     throw startPromise
//   }
//   return <Suspense fallback={null}>{props.children}</Suspense>
// }
