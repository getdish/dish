import React, { Suspense, useLayoutEffect } from 'react'
import { AbsoluteVStack, ToastRoot, VStack, useTheme } from 'snackui'

import { AppAutocompleteLocation } from './AppAutocompleteLocation'
import { AppAutocompleteSearch } from './AppAutocompleteSearch'
import { AppMapContents } from './AppMap'
import { AppMapControls } from './AppMapControls'
import { AppMenuButtonFloating } from './AppMenuButtonFloating'
import { AppSearchBarInline } from './AppSearchBarInline'
import { AutocompleteEffects } from './AutocompletesStore'
import { AppFloatingTagMenuBar } from './home/AppFloatingTagMenuBar'
import GalleryPage from './home/gallery/GalleryPage'
import { HomeStackViewPages } from './home/HomeStackViewPages'
import RestaurantHoursPage from './home/restaurantHours/RestaurantHoursPage'
import RestaurantReviewPage from './home/restaurantReview/RestaurantReviewPage'
import { useHomeStore } from './homeStore'
import { Route } from './Route'

// this would be the start of rendering mobile web flat style

export const AppHomeMobileWeb = () => {
  const theme = useTheme()
  const { currentState } = useHomeStore()
  console.log('currentState', currentState)

  useLayoutEffect(() => {
    document.querySelector('html')!.classList.add('mobile-layout')
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <ToastRoot />
        <AutocompleteEffects />
      </Suspense>
      <Suspense fallback={null}>
        <VStack marginBottom={-10} height={300} position="relative" zIndex={0}>
          <AbsoluteVStack zIndex={10000} pointerEvents="none" bottom={10}>
            <AppFloatingTagMenuBar />
          </AbsoluteVStack>
          <AppMenuButtonFloating />
          <AppMapControls />
          <AppMapContents />
        </VStack>
        <VStack
          shadowColor="#000"
          shadowRadius={25}
          shadowOpacity={0.1}
          zIndex={100}
          borderRadius={10}
          overflow="hidden"
          position="relative"
        >
          <AbsoluteVStack fullscreen zIndex={0} backgroundColor={theme.mapBackground} />
          <AppSearchBarInline />
          <VStack position="relative">
            <AppAutocompleteSearch />
            <AppAutocompleteLocation />
            <HomeStackViewPages key={currentState.id} isActive item={currentState} index={0} />
          </VStack>
        </VStack>
      </Suspense>
      <Suspense fallback={null}>
        <GalleryPage />
        <RestaurantReviewPage />
        <Route name="restaurantHours">
          <RestaurantHoursPage />
        </Route>
      </Suspense>
    </>
  )
}
