import { useHydrateCache } from '@dish/graph'
import { ProvideRouter } from '@dish/router'
import { allStores, configureUseStore } from '@dish/use-store'
import { Provider } from 'overmind-react'
import React, { Suspense } from 'react'
import { QueryClientProvider } from 'react-query'
import { ThemeProvider, configureThemes } from 'snackui'

import { App } from './app/App'
import { AppPortalProvider } from './app/AppPortal'
import { queryClient } from './helpers/queryClient'
import { routes } from './router'
import themes, { MyTheme, MyThemes } from './constants/themes'

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

export function Root({ overmind }: { overmind?: any }) {
  if (cacheSnapshot) {
    console.debug('cacheSnapshot', cacheSnapshot)
    useHydrateCache({
      cacheSnapshot,
    })
  } else {
    console.debug('no cache snapshot')
  }

  return (
    <Provider value={overmind}>
      <ProvideRouter routes={routes}>
        <ThemeProvider themes={themes} defaultTheme="light">
          <QueryClientProvider client={queryClient}>
            <AppPortalProvider>
              <Suspense fallback={null}>
                <App />
              </Suspense>
            </AppPortalProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </ProvideRouter>
    </Provider>
  )
}
