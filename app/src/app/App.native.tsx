import AppMap from './AppMap'
import AppMapContainer from './AppMapContainer'
import { AppMenuButtonFloating } from './AppMenuButtonFloating'
import { AutocompleteEffects } from './AutocompletesStore'
import { RootPortalProvider } from './Portal'
import { Route } from './Route'
import { Home } from './home/Home'
import GalleryPage from './home/gallery/GalleryPage'
import RestaurantHoursPage from './home/restaurantHours/RestaurantHoursPage'
import RestaurantReviewPage from './home/restaurantReview/RestaurantReviewPage'
import { AbsoluteYStack, YStack, useTheme, useThemeName } from '@dish/ui'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
// import { StatusBar } from 'expo-status-bar'
import React, { Suspense, memo } from 'react'
import { LogBox, StatusBar } from 'react-native'

LogBox.ignoreAllLogs(true)

export const App = memo(() => {
  return (
    <BottomSheetModalProvider>
      <RootPortalProvider />
      <AppStatusBar />
      <AutocompleteEffects />
      {/* <AbsoluteYStack fullscreen backgroundColor="$backgroundStrong"> */}
      <Suspense fallback={null}>
        <AppMapContainer>
          <AppMap />
        </AppMapContainer>
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
      {/* </AbsoluteYStack> */}
    </BottomSheetModalProvider>
  )
})

const AppStatusBar = () => {
  const themeName = useThemeName()
  return <StatusBar barStyle={themeName === 'light' ? 'light-content' : 'dark-content'} />
}
