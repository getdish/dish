import { useHydrateCache } from '@dish/graph'
import { ProvideRouter } from '@dish/router'
import { Provider } from 'overmind-react'
import React from 'react'
import { QueryClientProvider } from 'react-query'
import { ThemeProvider, configureThemes } from 'snackui'

import App from '../shared/App'
import { AppPortalProvider } from '../shared/AppPortal'
import { queryClient } from '../shared/helpers/queryClient'
import { router } from '../shared/state/router.1'
import themes, { MyTheme, MyThemes } from '../shared/themes'

if (typeof window !== 'undefined') {
  window['requestIdleCallback'] = window['requestIdleCallback'] || setTimeout
}

declare module 'snackui' {
  interface ThemeObject extends MyTheme {}
  interface Themes extends MyThemes {}
}

configureThemes(themes)

const cacheSnapshot =
  //@ts-expect-error
  typeof window !== 'undefined' ? window.__CACHE_SNAPSHOT : undefined

export function Root({ overmind }: { overmind?: any }) {
  if (cacheSnapshot) {
    console.debug('cacheSnapshot', cacheSnapshot)
    useHydrateCache({
      cacheSnapshot,
    })
  } else {
    console.debug('no cache snapshot')
  }

  console.log('provide from root', overmind)

  return (
    <Provider value={overmind}>
      <ProvideRouter router={router}>
        <ThemeProvider themes={themes} defaultTheme="light">
          <QueryClientProvider client={queryClient}>
            <AppPortalProvider>
              <App />
            </AppPortalProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </ProvideRouter>
    </Provider>
  )
}
