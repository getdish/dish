import { useHydrateCache } from '@dish/graph'
import { ProvideRouter, useRouter } from '@dish/router'
import { Provider } from 'overmind-react'
import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { QueryClientProvider } from 'react-query'
import { ThemeProvider, configureThemes } from 'snackui'

import App from '../shared/App'
import { AppPortalProvider } from '../shared/AppPortal'
import { queryClient } from '../shared/helpers/queryClient'
import { routes } from '../shared/state/router'
import { useOvermind } from '../shared/state/useOvermind'
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

  return (
    <Provider value={overmind}>
      <ProvideRouter routes={routes}>
        <ThemeProvider themes={themes} defaultTheme="light">
          <QueryClientProvider client={queryClient}>
            <AppPortalProvider>
              <Suspense fallback={null}>
                <RouterToOmEffect />
                <RouterPauseEffect />
                <App />
              </Suspense>
            </AppPortalProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </ProvideRouter>
    </Provider>
  )
}

let done = null
const doneRouting = wrapPromise(
  new Promise((res) => {
    done = res
  })
)

const RouterPauseEffect = () => {
  console.log('effect1')
  doneRouting.read()
  console.log('effect2')
  return null
}

const RouterToOmEffect = () => {
  const router = useRouter()
  const om = useOvermind()

  useLayoutEffect(() => {
    router.onRouteChange((item) => {
      om.actions.home.handleRouteChange(item)
      done()
    })
  }, [])

  return null
}

function wrapPromise(promise: Promise<any>) {
  let status = 'pending'
  let response

  const suspender = promise.then(
    (res) => {
      status = 'success'
      response = res
    },
    (err) => {
      status = 'error'
      response = err
    }
  )

  const read = () => {
    switch (status) {
      case 'pending':
        console.log('throwing')
        throw suspender
      case 'error':
        throw response
      default:
        return response
    }
  }

  return { read }
}
