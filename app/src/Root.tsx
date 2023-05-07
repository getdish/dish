import { DebugHUD } from './DebugHUD'
import { Radar } from './Radar'
import { App } from './app/App'
import { homeStore } from './app/homeStore'
import { useUserStore, userStore } from './app/userStore'
import { showRadar } from './constants/constants'
import { getInitialHomeState } from './constants/initialHomeState'
import { tagDefaultAutocomplete, tagFilters, tagLenses } from './constants/localTags'
import './globals'
import { addTagsToCache } from './helpers/allTags'
import { DRoutesTable, router, routes } from './router'
import config from './tamagui.config'
import { createAuth, useHydrateCache } from '@dish/graph'
import { configureAssertHelpers } from '@dish/helpers'
import { ProvideRouter } from '@dish/router'
import { PortalProvider, Square, TamaguiProvider, Toast, isWeb } from '@dish/ui'
import { Inter_400Regular, Inter_800ExtraBold } from '@expo-google-fonts/inter'
import { configureUseStore } from '@tamagui/use-store'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import React, { Suspense, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'

declare module '@dish/router' {
  interface RoutesTable extends DRoutesTable {}
}

let isStarted = false

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

  addTagsToCache([...tagDefaultAutocomplete, ...tagFilters, ...tagLenses])

  await createAuth()
  await userStore.checkForExistingLogin()

  await Promise.all([
    //
    homeStore.mount(),
    userStore.mount(),
  ])

  const { initialHomeState } = await getInitialHomeState()

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

  await new Promise<void>((res) => {
    router.onRouteChange((item) => {
      homeStore.handleRouteChange(item)
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
