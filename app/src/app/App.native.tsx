// import { StatusBar } from 'expo-status-bar'
import React, { Suspense } from 'react'
import { LogBox } from 'react-native'
import { AbsoluteVStack, useTheme } from 'snackui'

import AppMap from './AppMap'
import { AppMenuButton } from './AppMenuButton'
import { AutocompleteEffects } from './AutocompletesStore'
import GalleryPage from './home/gallery/GalleryPage'
import { Home } from './home/Home'
import RestaurantHoursPage from './home/restaurantHours/RestaurantHoursPage'
import RestaurantReviewPage from './home/restaurantReview/RestaurantReviewPage'
import { Route } from './Route'

LogBox.ignoreAllLogs(true)

export function App() {
  const theme = useTheme()

  return (
    <>
      {/* <StatusBar style="dark" /> */}
      <AutocompleteEffects />
      <AbsoluteVStack fullscreen backgroundColor={theme.mapBackground}>
        <Suspense fallback={null}>
          {/* keep indent  */}
          <AppMap />
        </Suspense>

        <Home />

        <AppMenuButton />

        <Suspense fallback={null}>
          <GalleryPage />
          <RestaurantReviewPage />
          <Route name="restaurantHours">
            <RestaurantHoursPage />
          </Route>
        </Suspense>
      </AbsoluteVStack>
    </>
  )
}
