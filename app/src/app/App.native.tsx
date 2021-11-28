import { AbsoluteYStack, useTheme, useThemeName } from '@dish/ui'
// import { StatusBar } from 'expo-status-bar'
import React, { Suspense } from 'react'
import { LogBox, StatusBar } from 'react-native'

import AppMap from './AppMap'
import { AppMenuButtonFloating } from './AppMenuButtonFloating'
import { AutocompleteEffects } from './AutocompletesStore'
import GalleryPage from './home/gallery/GalleryPage'
import { Home } from './home/Home'
import RestaurantHoursPage from './home/restaurantHours/RestaurantHoursPage'
import RestaurantReviewPage from './home/restaurantReview/RestaurantReviewPage'
import { RootPortalProvider } from './Portal'
import { Route } from './Route'

LogBox.ignoreAllLogs(true)

export function App() {
  console.warn('todo re-enable')
  return (
    <>
      {/* <RootPortalProvider />
      <AppStatusBar />
      <AutocompleteEffects /> */}
      <AbsoluteYStack fullscreen backgroundColor="$mapBackground">
        <Suspense fallback={null}>
          {/* keep indent  */}
          {/* <AppMap /> */}
        </Suspense>

        <Home />

        <AppMenuButtonFloating />

        <Suspense fallback={null}>
          <GalleryPage />
          <RestaurantReviewPage />
          <Route name="restaurantHours">
            <RestaurantHoursPage />
          </Route>
        </Suspense>
      </AbsoluteYStack>
    </>
  )
}

const AppStatusBar = () => {
  const themeName = useThemeName()
  return <StatusBar barStyle={themeName === 'light' ? 'light-content' : 'dark-content'} />
}
