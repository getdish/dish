import { AbsoluteYStack, ToastRoot, YStack, useTheme } from '@dish/ui'
import { reaction } from '@dish/use-store/dist'
import React, { Suspense, useEffect, useLayoutEffect } from 'react'

import { router } from '../router'
import { AppAutocompleteLocation } from './AppAutocompleteLocation'
import { AppAutocompleteSearch } from './AppAutocompleteSearch'
import { AppMapContents } from './AppMap'
import { AppMapControls } from './AppMapControls'
import { AppMenuButtonFloating } from './AppMenuButtonFloating'
import { AppSearchBarInline } from './AppSearchBarInline'
import { AutocompleteEffects, autocompletesStore } from './AutocompletesStore'
import { AppFloatingTagMenuBar } from './home/AppFloatingTagMenuBar'
import GalleryPage from './home/gallery/GalleryPage'
import { HomeStackViewPages } from './home/HomeStackViewPages'
import RestaurantHoursPage from './home/restaurantHours/RestaurantHoursPage'
import RestaurantReviewPage from './home/restaurantReview/RestaurantReviewPage'
import { useHomeStore } from './homeStore'
import { RootPortalProvider } from './Portal'
import { Route } from './Route'

// this would be the start of rendering mobile web flat style

const mapHeight = 310

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
    document.documentElement.scrollTo(0, 0)
  }, [currentState.id])

  useEffect(() => {
    let last
    return reaction(
      autocompletesStore,
      (x) => {
        console.log('huh?', x)
        return x?.visible
      },
      (visible) => {
        if (visible) {
          last = document.documentElement.scrollTop
          document.documentElement.scrollTo(mapHeight, 0)
        } else {
          document.documentElement.scrollTo(last, 0)
        }
      }
    )
  }, [])

  useLayoutEffect(() => {
    document.querySelector('html')!.classList.add('mobile-layout')
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <ToastRoot />
        <AutocompleteEffects />
      </Suspense>
      <AbsoluteYStack
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
      </AbsoluteYStack>
      <YStack marginBottom={-40} height={mapHeight} position="relative" zIndex={0}>
        <Suspense fallback={null}>
          <AbsoluteYStack zIndex={10000} pointerEvents="none" bottom={40}>
            <AppFloatingTagMenuBar />
          </AbsoluteYStack>
          <AppMenuButtonFloating />
          <AppMapControls />
          <AppMapContents />
        </Suspense>
      </YStack>
      <YStack
        shadowColor="#000"
        shadowRadius={25}
        shadowOpacity={0.1}
        zIndex={100}
        borderRadius={10}
        overflow="hidden"
        position="relative"
      >
        <AbsoluteYStack fullscreen zIndex={0} backgroundColor={theme.mapBackground} />
        <AppSearchBarInline />
        <YStack position="relative" minHeight={600}>
          <AppAutocompleteSearch />
          <AppAutocompleteLocation />
          <HomeStackViewPages key={currentState.id} isActive item={currentState} index={0} />
        </YStack>
      </YStack>
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
