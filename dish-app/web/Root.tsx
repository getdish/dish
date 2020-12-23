import { useHydrateCache } from '@dish/graph'
import { ProvideRouter } from '@dish/router'
import { Provider } from 'overmind-react'
import React, { Suspense } from 'react'
import { QueryClientProvider } from 'react-query'
import {
  LoadingItems,
  ThemeProvider,
  ToastRoot,
  configureThemes,
} from 'snackui'

import App from '../shared/App'
import { AppPortalProvider } from '../shared/AppPortal'
import { queryClient } from '../shared/helpers/queryClient'
import AdminPage from '../shared/pages/admin/AdminPage'
import { Shortcuts } from '../shared/Shortcuts'
import { router } from '../shared/state/router.1'
import themes, { MyTheme, MyThemes } from '../shared/themes'
import { NotFoundPage } from '../shared/views/NotFoundPage'
import { PrivateRoute, Route, RouteSwitch } from '../shared/views/router/Route'

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
    console.log('cacheSnapshot', cacheSnapshot)
    useHydrateCache({
      cacheSnapshot,
    })
  } else {
    console.log('no cache snapshot')
  }

  return (
    <ProvideRouter router={router}>
      <ThemeProvider themes={themes} defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <AppPortalProvider>
            <Provider value={overmind}>
              <ToastRoot />
              <Shortcuts />
              <Suspense fallback={<LoadingItems />}>
                <RouteSwitch>
                  <Route name="notFound">
                    <NotFoundPage title="404 Not Found" />
                  </Route>
                  <PrivateRoute name="admin">
                    <AdminPage />
                  </PrivateRoute>
                  <Route name="home">
                    <App />
                  </Route>
                </RouteSwitch>
              </Suspense>
            </Provider>
          </AppPortalProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ProvideRouter>
  )
}
