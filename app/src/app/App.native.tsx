import { AbsoluteYStack, useTheme } from '@dish/ui'
// import { StatusBar } from 'expo-status-bar'
import React, { Suspense } from 'react'
import { LogBox } from 'react-native'

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
  const theme = useTheme()

  return (
    <>
      <RootPortalProvider />
      {/* <StatusBar style="dark" /> */}
      <AutocompleteEffects />
      <AbsoluteYStack fullscreen backgroundColor={theme.mapBackground}>
        <Suspense fallback={null}>
          {/* keep indent  */}
          <AppMap />
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
