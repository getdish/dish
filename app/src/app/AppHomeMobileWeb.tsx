import { router } from '../router'
import { AppAutocompleteLocation } from './AppAutocompleteLocation'
import { AppAutocompleteSearch } from './AppAutocompleteSearch'
import { AppMapContents } from './AppMap'
import { AppMapControls } from './AppMapControls'
import { AppMenuButtonFloating } from './AppMenuButtonFloating'
import { AppSearchBarInline } from './AppSearchBarInline'
import { AutocompleteEffects, autocompletesStore } from './AutocompletesStore'
import { RootPortalProvider } from './Portal'
import { Route } from './Route'
import { AppFloatingTagMenuBar } from './home/AppFloatingTagMenuBar'
import { HomeStackViewPages } from './home/HomeStackViewPages'
import GalleryPage from './home/gallery/GalleryPage'
import RestaurantHoursPage from './home/restaurantHours/RestaurantHoursPage'
import RestaurantReviewPage from './home/restaurantReview/RestaurantReviewPage'
import { useHomeStore } from './homeStore'
import { AbsoluteYStack, ToastRoot, YStack, useTheme } from '@dish/ui'
import { reaction } from '@dish/use-store'
import React, { Suspense, useEffect, useLayoutEffect } from 'react'

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
      {/* @ts-ignore */}
      <YStack pos="fixed" fullscreen pe="none" t={0} l={0} r={0} h="100vh" mh="100vh" zi={1000000}>
        <RootPortalProvider />
      </YStack>
      <YStack mb={-40} height={mapHeight} p="relative" zi={0}>
        <Suspense fallback={null}>
          <AbsoluteYStack zi={10000} pe="none" b={40}>
            <AppFloatingTagMenuBar />
          </AbsoluteYStack>
          <AppMenuButtonFloating />
          <AppMapControls />
          <AppMapContents />
        </Suspense>
      </YStack>
      <YStack zi={100} br={10} ov="hidden" pos="relative">
        <AbsoluteYStack fullscreen zi={0} backgroundColor="$backgroundStronger" />
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
