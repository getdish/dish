import './_polyfill'
// import { DebugHUD } from './DebugHUD'
// import { Radar } from './Radar'
import { App, useLoadApp } from './app/App'
import { homeStore } from './app/homeStore'
import { useUserStore, userStore } from './app/userStore'
import { showRadar } from './constants/constants'
import { getInitialHomeState } from './constants/initialHomeState'
import { tagDefaultAutocomplete, tagFilters, tagLenses } from './constants/localTags'
import './globals'
import { addTagsToCache } from './helpers/allTags'
import { DRoutesTable, router, routes } from './router'
import config from './tamagui.config'
import { createAuth, useHydrateCache } from '@dish/graph'
import { configureAssertHelpers } from '@dish/helpers'
import { ProvideRouter } from '@dish/router'
import { PortalProvider, TamaguiProvider, Toast, isWeb } from '@dish/ui'
import { configureUseStore } from '@tamagui/use-store'
import React, { Suspense, useEffect, useState } from 'react'
import { View, useColorScheme } from 'react-native'

declare module '@dish/router' {
  interface RoutesTable extends DRoutesTable {}
}

let isStarted = false

async function start() {
  if (isStarted) {
    return
  }

  if (process.env.TAMAGUI_TARGET === 'native') {
  }

  addTagsToCache([...tagDefaultAutocomplete, ...tagFilters, ...tagLenses])

  await createAuth()
  await userStore.checkForExistingLogin()

  await Promise.all([
    //
    homeStore.mount(),
    userStore.mount(),
  ])

  const { initialHomeState } = await getInitialHomeState()

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

  await new Promise<void>((res) => {
    router.onRouteChange((item) => {
      homeStore.handleRouteChange(item)
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
  // console.log('loading root')
  const [stateLoaded, setStateLoaded] = useState(false)
  const appLoaded = useLoadApp()
  const userStore = useUserStore()
  const colorScheme = useColorScheme()

  if (cacheSnapshot) {
    useHydrateCache({
      cacheSnapshot,
    })
  }

  useEffect(() => {
    start().then(() => {
      setStateLoaded(true)
    })
  }, [])

  const isLoaded = stateLoaded && appLoaded

  const defaultTheme =
    (!userStore.theme || userStore.theme === 'auto' ? colorScheme : userStore.theme) ??
    colorScheme ??
    'dark'

  // return <View style={{ width: 100, height: 100, backgroundColor: 'red' }} />

  return (
    <TamaguiProvider config={config} defaultTheme={defaultTheme}>
      <ProvideRouter routes={routes}>
        <PortalProvider>
          <Suspense fallback={null}>
            {/* <View style={{ width: 100, height: 100, backgroundColor: 'red' }} /> */}
            {isLoaded ? (
              <>
                <App />
                {/* {process.env.NODE_ENV === 'development' && <DebugHUD />} */}
                {isWeb && <div id="before-bottom-sheet-temp" />}
              </>
            ) : null}
          </Suspense>
        </PortalProvider>
        {/* {showRadar && <Radar />} */}
      </ProvideRouter>
    </TamaguiProvider>
  )
}
