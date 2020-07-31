import { LngLat } from '@dish/graph/_'
// debug
import { AbsoluteVStack, HStack, VStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'
import { Map, RefreshCcw } from 'react-feather'

import {
  searchBarHeight,
  zIndexDrawer,
  zIndexMapControls,
  zIndexMapControlsUnderlay,
  zIndexMapControlsUnderlaySmall,
} from '../../constants'
import { initialHomeState } from '../../state/home'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { OverlayLinkButton } from '../../views/ui/OverlayLinkButton'
import { useMapSize } from './HomeMap'
import { HomeMapPIP } from './HomeMapPIP'
import { HomeMapRestaurantPeek } from './HomeMapRestaurantPeek'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const getZoomLevel = (span: LngLat) => {
  const curZoom = (span.lat + span.lng) / 2
  return curZoom < 0.1 ? 'close' : curZoom > 0.2 ? 'far' : 'medium'
}

export const useZoomLevel = () => {
  const om = useOvermind()
  return getZoomLevel(om.state.home.currentState.span)
}

export const mapZoomToMedium = () => {
  let span = initialHomeState.span
  let center = initialHomeState.center
  for (const state of [...omStatic.state.home.states].reverse()) {
    if (getZoomLevel(state.span) === 'medium') {
      span = state.span
      center = state.center
      break
    }
  }
  omStatic.actions.home.updateCurrentState({
    span,
    center,
  })
}

export const HomeMapControlsUnderlay = memo(() => {
  const om = useOvermind()
  const zoomLevel = useZoomLevel()
  const hasMovedMap = om.state.home.currentState?.['hasMovedMap']
  const isSmall = useMediaQueryIsSmall()
  const { paddingLeft, width } = useMapSize(isSmall)
  return (
    <AbsoluteVStack
      zIndex={isSmall ? zIndexDrawer - 1 : zIndexDrawer + 1}
      marginLeft="auto"
      fullscreen
      width={width}
      pointerEvents="none"
    >
      <AbsoluteVStack
        fullscreen
        padding={20}
        top={searchBarHeight + 10}
        left={paddingLeft}
        right={0}
        {...(isSmall && {
          maxWidth: '100%',
          left: 0,
          right: 0,
          top: 0,
        })}
        zIndex={20000000}
        alignItems="center"
        justifyContent="center"
      >
        <HStack
          position="absolute"
          top={10}
          right={0}
          left={0}
          alignItems="center"
          justifyContent="center"
          spacing={5}
        >
          {hasMovedMap && (
            <OverlayLinkButton
              Icon={RefreshCcw}
              pointerEvents="auto"
              alignItems="center"
              justifyContent="center"
              onPress={() => {
                om.actions.home.setHasMovedMap(false)
                om.actions.home.refresh()
              }}
            >
              Search here
            </OverlayLinkButton>
          )}

          {om.state.home.hoveredRestaurant &&
            om.state.home.currentStateType === 'search' && (
              <OverlayLinkButton
                Icon={Map}
                pointerEvents="auto"
                alignItems="center"
                justifyContent="center"
                onPress={() => {
                  om.actions.home.setHasMovedMap(false)
                  om.actions.home.setHoveredRestaurant(false)
                }}
              >
                Show all
              </OverlayLinkButton>
            )}

          {zoomLevel !== 'medium' && (
            <OverlayLinkButton
              Icon={Map}
              pointerEvents="auto"
              alignItems="center"
              justifyContent="center"
              onPress={mapZoomToMedium}
            >
              Zoom out
            </OverlayLinkButton>
          )}
        </HStack>

        <HStack position="absolute" bottom={0} right={0} left={0}>
          {!isSmall && (
            <HStack
              flexDirection="row-reverse"
              alignItems="flex-end"
              flex={1}
              overflow="hidden"
              justifyContent="space-between"
              flexWrap="wrap"
              paddingLeft={30}
              paddingRight={15}
              paddingBottom={15}
              paddingTop={20}
            >
              <Suspense fallback={null}>
                <HomeMapPIP />
              </Suspense>
              <HomeMapRestaurantPeek />
            </HStack>
          )}
        </HStack>
      </AbsoluteVStack>
    </AbsoluteVStack>
  )
})
