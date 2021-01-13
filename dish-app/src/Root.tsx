import { useHydrateCache } from '@dish/graph'
import { ProvideRouter } from '@dish/router'
import { allStores, configureUseStore } from '@dish/use-store'
import React, { Suspense } from 'react'
import { QueryClientProvider } from 'react-query'
import { ThemeProvider, configureThemes } from 'snackui'

import { App } from './app/App'
import { AppPortalProvider } from './app/AppPortal'
import { homeStore } from './app/homeStore'
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

global['stores'] = allStores

declare module 'snackui' {
  interface ThemeObject extends MyTheme {}
  interface Themes extends MyThemes {}
}

configureThemes(themes)
configureUseStore({
  logLevel: process.env.NODE_ENV === 'development' ? 'info' : 'error',
})

// @ts-expect-error
const cacheSnapshot = global.__CACHE_SNAPSHOT

let isStarted = false
let startPromise

async function start() {
  await new Promise<void>((res) => {
    addTagsToCache([...tagDefaultAutocomplete, ...tagFilters, ...tagLenses])
    router.onRouteChange((item) => {
      console.warn('router.onRouteChange', item)
      homeStore.handleRouteChange(item)
      res()
    })
    userStore.checkForExistingLogin()
  })
  isStarted = true
}

export function Root() {
  if (cacheSnapshot) {
    useHydrateCache({
      cacheSnapshot,
    })
  }

  return (
    <ThemeProvider themes={themes} defaultTheme="light">
      <ProvideRouter routes={routes}>
        <QueryClientProvider client={queryClient}>
          <AppPortalProvider>
            <Suspense fallback={null}>
              <RootInner />
            </Suspense>
          </AppPortalProvider>
        </QueryClientProvider>
      </ProvideRouter>
    </ThemeProvider>
  )
}

function RootInner() {
  if (!isStarted) {
    startPromise = start()
    throw startPromise
  }
  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  )
}
