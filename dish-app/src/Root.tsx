import { series } from '@dish/async'
import { useHydrateCache } from '@dish/graph'
import { ProvideRouter } from '@dish/router'
import { allStores, configureUseStore } from '@dish/use-store'
import React, { Suspense, useLayoutEffect, useState } from 'react'
import { QueryClientProvider } from 'react-query'
import { ThemeProvider, configureThemes } from 'snackui'

import { App } from './app/App'
import { AppPortalProvider } from './app/AppPortal'
import { addTagsToCache } from './helpers/allTags'
import { homeStore } from './app/homeStore'
import { userStore } from './app/userStore'
import {
  tagDefaultAutocomplete,
  tagFilters,
  tagLenses,
} from './constants/localTags'
import themes, { MyTheme, MyThemes } from './constants/themes'
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

export function Root() {
  const [isStarted, setIsStarted] = useState(false)

  // startup
  useLayoutEffect(() => {
    return series([
      () => {
        addTagsToCache([...tagDefaultAutocomplete, ...tagFilters, ...tagLenses])
        router.onRouteChange((item) => {
          homeStore.handleRouteChange(item)
        })
        userStore.checkForExistingLogin()
      },
      () => {
        setIsStarted(true)
      },
    ])
  })

  if (cacheSnapshot) {
    console.debug('cacheSnapshot', cacheSnapshot)
    useHydrateCache({
      cacheSnapshot,
    })
  } else {
    console.debug('no cache snapshot')
  }

  return (
    <ThemeProvider themes={themes} defaultTheme="light">
      <ProvideRouter routes={routes}>
        <QueryClientProvider client={queryClient}>
          <AppPortalProvider>
            <Suspense fallback={null}>{isStarted ? <App /> : null}</Suspense>
          </AppPortalProvider>
        </QueryClientProvider>
      </ProvideRouter>
    </ThemeProvider>
  )
}
