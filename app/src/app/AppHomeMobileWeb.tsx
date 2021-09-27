import React, { Suspense, useEffect, useLayoutEffect } from 'react'
import { AbsoluteVStack, ToastRoot, VStack, useTheme } from 'snackui'

import { router } from '../router'
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
import { homeStore, useHomeStore } from './homeStore'
import { RootPortalProvider } from './Portal'
import { Route } from './Route'

// this would be the start of rendering mobile web flat style

export const AppHomeMobileWeb = () => {
  const theme = useTheme()
  const { currentState } = useHomeStore()

  // TODO make this "remember" the last height so we can scroll smoothly
  // otherwise it jumps to empty and so scroll doesnt animate up
  // on new state, scroll to top
  useEffect(() => {
    if (router.curHistory.type !== 'push') {
      return
    }
    console.log('scroll to top')
    document.documentElement.scrollTo(0, 0)
  }, [currentState.id])

  useLayoutEffect(() => {
    document.querySelector('html')!.classList.add('mobile-layout')
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <ToastRoot />
        <AutocompleteEffects />
      </Suspense>
      <AbsoluteVStack
        // @ts-ignore
        position="fixed"
        fullscreen
        pointerEvents="none"
        top={0}
        left={0}
        right={0}
        height="100vh"
        maxHeight="100vh"
        zIndex={1000000}
      >
        <RootPortalProvider />
      </AbsoluteVStack>
      <VStack marginBottom={-40} height={310} position="relative" zIndex={0}>
        <Suspense fallback={null}>
          <AbsoluteVStack zIndex={10000} pointerEvents="none" bottom={40}>
            <AppFloatingTagMenuBar />
          </AbsoluteVStack>
          <AppMenuButtonFloating />
          <AppMapControls />
          <AppMapContents />
        </Suspense>
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
        <VStack position="relative" minHeight={500}>
          <AppAutocompleteSearch />
          <AppAutocompleteLocation />
          <HomeStackViewPages key={currentState.id} isActive item={currentState} index={0} />
        </VStack>
      </VStack>
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
