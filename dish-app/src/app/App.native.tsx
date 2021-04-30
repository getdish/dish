import { StatusBar } from 'expo-status-bar'
import React, { Suspense } from 'react'
import { LogBox } from 'react-native'
import { VStack, useTheme } from 'snackui'

import AppMap from './AppMap'
import { AppMenuButton } from './AppMenuButton'
import { useAppShouldShow } from './AppStore'
import { AutocompleteEffects } from './AutocompletesStore'
import GalleryPage from './home/gallery/GalleryPage'
import { Home } from './home/Home'
import RestaurantHoursPage from './home/restaurantHours/RestaurantHoursPage'
import RestaurantReviewPage from './home/restaurantReview/RestaurantReviewPage'
import { Route } from './Route'

LogBox.ignoreAllLogs(true)

export function App() {
  const theme = useTheme()
  const show = useAppShouldShow('map')

  return (
    <>
      <StatusBar style="dark" />
      <AutocompleteEffects />
      <VStack
        flex={1}
        backgroundColor={theme.mapBackground}
        alignItems="center"
        justifyContent="center"
      >
        {show && (
          <Suspense fallback={null}>
            <AppMap />
          </Suspense>
        )}

        <Home />

        <AppMenuButton />

        <Suspense fallback={null}>
          <GalleryPage />
          <RestaurantReviewPage />
          <Route name="restaurantHours">
            <RestaurantHoursPage />
          </Route>
        </Suspense>
      </VStack>
    </>
  )
}
