import { StatusBar } from 'expo-status-bar'
import { Provider } from 'overmind-react'
import React, { Suspense, useEffect, useState } from 'react'
import { LogBox } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { VStack } from 'snackui'

import { mapBackgroundColor } from '../constants/colors'
import AppMap from './AppMap'
import { AppMenuButton } from './AppMenuButton'
import GalleryPage from './home/gallery/GalleryPage'
import { Home } from './home/Home'
import RestaurantHoursPage from './home/restaurantHours/RestaurantHoursPage'
import RestaurantReviewPage from './home/restaurantReview/RestaurantReviewPage'
import { Route } from './Route'
import { om } from './state/om'

LogBox.ignoreAllLogs(true)

export function App() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    om.initialized.then(() => {
      setLoaded(true)
    })
  }, [])

  if (!loaded) {
    return null
  }

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaProvider>
        <Provider value={om}>
          <VStack
            flex={1}
            backgroundColor={mapBackgroundColor}
            alignItems="center"
            justifyContent="center"
          >
            <Suspense fallback={null}>
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
          </VStack>
        </Provider>
      </SafeAreaProvider>
    </>
  )
}
