// // debug
// // for testing quickly
// import React from 'react'
// import { Paragraph, ThemeProvider, configureThemes } from '@dish/ui'

// import themes from './constants/themes'

// configureThemes(themes)

// export function Root({ floating, size }) {
//   return (
//     <ThemeProvider themes={themes} defaultTheme="light">
//       <Paragraph color="red" size="$8">
//         test should be a snap. Know how you have your favorite nights out, places to walk, . Search
//         delivery apps have sketchy reviews and fake popups to boot.
//       </Paragraph>
//     </ThemeProvider>
//   )
// }

// ⚠️ NOTE TURNED OFF PRETTIER BECAUSE IT WAS ADDING `value` before all destructred imports
// due to the import sort plugin :/ couldn't figure out why even just a single import in the
// entire file caused it....

import './globals'

import { useHydrateCache } from '@dish/graph'
import { configureAssertHelpers } from '@dish/helpers'
import { ProvideRouter } from '@dish/router'
import { PopoverProvider, SafeAreaProvider, Theme, Toast } from '@dish/ui'
import { configureUseStore } from '@dish/use-store'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useColorScheme } from 'react-native'
import React, { Suspense, useEffect, useLayoutEffect, useState } from 'react'

import { App } from './app/App'
// import { App } from './app/App'
import { homeStore } from './app/homeStore'
import { useUserStore, userStore } from './app/userStore'
import { isWeb, showRadar } from './constants/constants'
import { initialHomeState } from './constants/initialHomeState'
import { tagDefaultAutocomplete, tagFilters, tagLenses } from './constants/localTags'
import { DebugHUD } from './DebugHUD'
import { addTagsToCache } from './helpers/allTags'
import { Radar } from './Radar'
import { DRoutesTable, router, routes } from './router'
import Tamagui from './tamagui.config'

declare module '@dish/router' {
  interface RoutesTable extends DRoutesTable {}
}

let isStarted = false
// let startPromise

async function start() {
  if (isStarted) {
    return
  }

  if (!isWeb) {
    await Font.loadAsync({
      Inter: require('./assets/fonts/Inter-Thin.otf'),
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

  if (isWeb) {
    useLayoutEffect(() => {
      const css = Tamagui.getCSS()

      const style = document.createElement('style')
      style.setAttribute('type', 'text/css')
      style.innerHTML = css
      document.querySelector('head')?.appendChild(style)
    }, [])
  }

  const defaultTheme =
    (userStore.theme === 'auto' ? colorScheme : userStore.theme) ?? colorScheme ?? 'dark'

  console.log('isLoaded', { isLoaded, defaultTheme })

  return (
    <SafeAreaProvider>
      <Tamagui.Provider defaultTheme={defaultTheme}>
        <Theme name={defaultTheme}>
          <ProvideRouter routes={routes}>
            <Suspense fallback={null}>
              <PopoverProvider>
                {isLoaded ? (
                  <>
                    <App />
                    {process.env.NODE_ENV === 'development' && <DebugHUD />}
                  </>
                ) : null}
              </PopoverProvider>
            </Suspense>
          </ProvideRouter>
        </Theme>
      </Tamagui.Provider>
      {showRadar && <Radar />}
    </SafeAreaProvider>
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
