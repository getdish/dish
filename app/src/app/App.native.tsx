// import { StatusBar } from 'expo-status-bar'
import React, { Suspense, useState } from 'react'
import { LogBox } from 'react-native'
import { AbsoluteVStack, Text, VStack, useTheme } from 'snackui'

import { AppMenuButtonFloating } from './AppMenuButtonFloating'
import { AutocompleteEffects } from './AutocompletesStore'
import GalleryPage from './home/gallery/GalleryPage'
import RestaurantHoursPage from './home/restaurantHours/RestaurantHoursPage'
import RestaurantReviewPage from './home/restaurantReview/RestaurantReviewPage'
import { Route } from './Route'

LogBox.ignoreAllLogs(true)

export function App() {
  const theme = useTheme()
  const [x, set] = useState('')

  return (
    <>
      {/* <StatusBar style="dark" /> */}
      <AutocompleteEffects />
      <AbsoluteVStack fullscreen backgroundColor={theme.mapBackground}>
        <Suspense fallback={null}>
          {/* keep indent  */}
          {/* <AppMap /> */}
        </Suspense>

        <VStack
          alignItems="center"
          justifyContent="center"
          margin="auto"
          width={300}
          height={300}
          backgroundColor="red"
          onPress={() => set('hi')}
          pointerEvents="auto"
        >
          <Text fontSize={20} color="#fff">
            {x || 'not pressed?'}
          </Text>
        </VStack>

        {/* <Home /> */}

        <AppMenuButtonFloating />

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
