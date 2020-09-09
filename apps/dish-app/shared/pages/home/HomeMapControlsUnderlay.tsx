import { AbsoluteVStack, HStack } from '@dish/ui'
import React, { memo } from 'react'
import { Map, RefreshCcw } from 'react-feather'

import { searchBarHeight, zIndexDrawer } from '../../constants'
import { useOvermind } from '../../state/om'
import { OverlayLinkButton } from '../../views/ui/OverlayLinkButton'
import { mapZoomToMedium, useZoomLevel } from './mapHelpers'
import { useMapSize } from './useMapSize'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const HomeMapControlsUnderlay = memo(() => {
  const om = useOvermind()
  const zoomLevel = useZoomLevel()
  const hasMovedMap =
    !!om.state.home.currentState.mapAt &&
    om.state.home.currentStateType === 'search'
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
        paddingHorizontal={30}
        top={searchBarHeight + 10}
        left={paddingLeft + 20}
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
          flexWrap="wrap"
          overflow="hidden"
          spacing={5}
        >
          {hasMovedMap && (
            <OverlayLinkButton
              Icon={RefreshCcw}
              pointerEvents="auto"
              alignItems="center"
              justifyContent="center"
              onPress={() => {
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
                  om.actions.home.setHoveredRestaurant(false)
                }}
              >
                Show all
              </OverlayLinkButton>
            )}

          {hasMovedMap && zoomLevel !== 'medium' && (
            <OverlayLinkButton
              Icon={Map}
              pointerEvents="auto"
              alignItems="center"
              justifyContent="center"
              onPress={mapZoomToMedium}
            >
              Fit to results
            </OverlayLinkButton>
          )}
        </HStack>
      </AbsoluteVStack>
    </AbsoluteVStack>
  )
})
