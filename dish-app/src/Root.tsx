// for testing quickly
// import { Button, ThemeProvider, configureThemes } from 'snackui'

// import themes from './constants/themes'

// configureThemes(themes)

// export function Root() {
//   console.log('hi')
//   return (
//     <ThemeProvider themes={themes} defaultTheme="light">
//       <Button pointerEvents="auto" backgroundColor="red">
//         hello
//       </Button>
//     </ThemeProvider>
//   )
// }

// import './whydidyourender'
import './globals'

import { useHydrateCache } from '@dish/graph'
import { configureAssertHelpers } from '@dish/helpers'
import { ProvideRouter } from '@dish/router'
import { configureUseStore } from '@dish/use-store'
import React, { Suspense, useEffect } from 'react'
import { QueryClientProvider } from 'react-query'
import { ThemeProvider, Toast, configureThemes } from 'snackui'

import { App } from './app/App'
import { AppPortalProvider } from './app/AppPortal'
import { homeStore } from './app/homeStore'
import { PlatformSpecificProvider } from './app/PlatformSpecificProvider'
import { userStore } from './app/userStore'
import {
  tagDefaultAutocomplete,
  tagFilters,
  tagLenses,
} from './constants/localTags'
import themes, { MyTheme, MyThemes } from './constants/themes'
import { addTagsToCache } from './helpers/allTags'
import { queryClient } from './helpers/queryClient'
import { router, routes } from './router'

declare module 'snackui' {
  interface ThemeObject extends MyTheme {}
  interface Themes extends MyThemes {}
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
configureAssertHelpers({
  onAssertFail: (why) => {
    if (why) {
      Toast.error(why)
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.groupCollapsed('Assertion exited')
        console.trace()
        console.groupEnd()
      }
    }
  },
})

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
  if (cacheSnapshot) {
    useHydrateCache({
      cacheSnapshot,
    })
  }

  useEffect(() => {
    start()
  }, [])

  return (
    <PlatformSpecificProvider>
      <ThemeProvider themes={themes} defaultTheme="light">
        <ProvideRouter routes={routes}>
          <QueryClientProvider client={queryClient}>
            <AppPortalProvider>
              <Suspense fallback={null}>
                <App />
              </Suspense>
            </AppPortalProvider>
          </QueryClientProvider>
        </ProvideRouter>
      </ThemeProvider>
    </PlatformSpecificProvider>
  )
}
