// // debug
// // for testing quickly
// import React from 'react'
// import { Paragraph, ThemeProvider, configureThemes } from 'snackui'

// import themes from './constants/themes'

// configureThemes(themes)

// export function Root({ floating, size }) {
//   return (
//     <ThemeProvider themes={themes} defaultTheme="light">
//       <Paragraph color="red" size="xxl">
//         test should be a snap. Know how you have your favorite nights out, places to walk, . Search
//         delivery apps have sketchy reviews and fake popups to boot.
//       </Paragraph>
//     </ThemeProvider>
//   )
// }

import './globals'

import { useHydrateCache } from '@dish/graph'
import { configureAssertHelpers } from '@dish/helpers'
import { ProvideRouter } from '@dish/router'
import { configureUseStore } from '@dish/use-store'
import AppLoading from 'expo-app-loading'
import React, { Suspense, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { QueryClientProvider } from 'react-query'
import {
  AbsoluteVStack,
  Paragraph,
  SnackUIProvider,
  Toast,
  configureThemes,
  useSafeAreaInsets,
} from 'snackui'

import { App } from './app/App'
import { homeStore } from './app/homeStore'
import { useUserStore, userStore } from './app/userStore'
import { showRadar } from './constants/constants'
import { initialHomeState } from './constants/initialHomeState'
import { tagDefaultAutocomplete, tagFilters, tagLenses } from './constants/localTags'
import { isHermes } from './constants/platforms'
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
  if (isStarted) {
    return
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
      startPromise = null
      res()
    })
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

const DebugHUD = () => {
  const safeArea = useSafeAreaInsets()
  return (
    <Paragraph
      position="absolute"
      bottom={safeArea.bottom + 5}
      right={safeArea.right + 5}
      backgroundColor="#fff"
      color="#000"
      opacity={0.2}
      size="xxs"
    >
      {isHermes ? 'hermes' : 'jsc'}
    </Paragraph>
  )
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
      <SnackUIProvider themes={themes} defaultTheme={userStore.theme ?? colorScheme ?? 'dark'}>
        <ProvideRouter routes={routes}>
          <QueryClientProvider client={queryClient}>
            <Suspense fallback={null}>
              {!isLoaded && <AppLoading />}
              {isLoaded ? <App /> : null}

              {process.env.NODE_ENV === 'development' && <DebugHUD />}
            </Suspense>
          </QueryClientProvider>
        </ProvideRouter>
      </SnackUIProvider>
      {showRadar && <Radar />}
    </>
  )
}

function Radar() {
  if (process.env.NODE_ENV === 'development') {
    const LagRadar = require('react-lag-radar').default
    return (
      <AbsoluteVStack bottom={20} right={20} zIndex={10000} pointerEvents="none">
        <LagRadar frames={20} speed={0.0017} size={100} inset={3} />
      </AbsoluteVStack>
    )
  }

  return null
}
