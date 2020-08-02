import { AbsoluteVStack, HStack } from '@dish/ui'
import React, { memo } from 'react'
import { Map, RefreshCcw } from 'react-feather'

import { searchBarHeight, zIndexDrawer } from '../../constants'
import { useOvermind } from '../../state/useOvermind'
import { OverlayLinkButton } from '../../views/ui/OverlayLinkButton'
import { useMapSize } from './HomeMap'
import { mapZoomToMedium, useZoomLevel } from './mapHelpers'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

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
      </AbsoluteVStack>
    </AbsoluteVStack>
  )
})
