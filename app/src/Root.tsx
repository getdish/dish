// import { CardFrame } from './app/views/CardFrame'

// CardFrame

// // debug
// // for testing quickly
// import React from 'react'
// import { AbsoluteVStack, ThemeProvider, VStack, configureThemes, useTheme } from 'snackui'

// import { StackDrawer } from './app/views/StackDrawer'
// import themes from './constants/themes'

// configureThemes(themes)

// export function Root({ floating, size }) {
//   return (
//     <ThemeProvider themes={themes} defaultTheme="light">
//       <AbsoluteVStack fullscreen backgroundColor="#fff">
//         <StackDrawer />
//       </AbsoluteVStack>
//     </ThemeProvider>
//   )
// }

import './globals'

import { useHydrateCache } from '@dish/graph'
import { configureAssertHelpers } from '@dish/helpers'
import { ProvideRouter } from '@dish/router'
import { configureUseStore } from '@dish/use-store'
import AppLoading from 'expo-app-loading'
import React, { StrictMode, Suspense, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClientProvider } from 'react-query'
import { ThemeProvider, Toast, configureThemes } from 'snackui'

import { App } from './app/App'
import { homeStore } from './app/homeStore'
import { PlatformSpecificProvider } from './app/PlatformSpecificProvider'
import { RootPortalProvider } from './app/Portal'
import { useUserStore, userStore } from './app/userStore'
import { tagDefaultAutocomplete, tagFilters, tagLenses } from './constants/localTags'
import themes, { MyTheme, MyThemes } from './constants/themes'
import { addTagsToCache } from './helpers/allTags'
import { queryClient } from './helpers/queryClient'
import { DRoutesTable, router, routes } from './router'

declare module 'snackui' {
  interface ThemeObject extends MyTheme {}
  interface Themes extends MyThemes {}
}

declare module '@dish/router' {
  interface RoutesTable extends DRoutesTable {}
}

let isStarted = false
let startPromise

async function start() {
  if (isStarted) return
  await new Promise<void>((res) => {
    addTagsToCache([...tagDefaultAutocomplete, ...tagFilters, ...tagLenses])
    router.onRouteChange((item) => {
      homeStore.handleRouteChange(item)
      startPromise = null
      res()
    })
    userStore.checkForExistingLogin()
  })
  isStarted = true
}

configureThemes(themes)
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

// @ts-expect-error
const cacheSnapshot = global.__CACHE_SNAPSHOT

// can be used by ssr in the future to load app
export function RootSuspenseLoad(props: any) {
  if (!isStarted && !startPromise) {
    startPromise = start()
  }
  if (startPromise) {
    throw startPromise
  }
  return <Suspense fallback={null}>{props.children}</Suspense>
}

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
    start().then(() => {
      setIsLoaded(true)
    })
  }, [])

  return (
    <>
      <SafeAreaProvider>
        <PlatformSpecificProvider>
          <ThemeProvider themes={themes} defaultTheme={userStore.theme ?? colorScheme ?? 'dark'}>
            <ProvideRouter routes={routes}>
              <QueryClientProvider client={queryClient}>
                <Suspense fallback={null}>
                  {!isLoaded && <AppLoading />}
                  {isLoaded ? <App /> : null}
                </Suspense>
                <RootPortalProvider />
              </QueryClientProvider>
            </ProvideRouter>
          </ThemeProvider>
        </PlatformSpecificProvider>
      </SafeAreaProvider>
    </>
  )
}
