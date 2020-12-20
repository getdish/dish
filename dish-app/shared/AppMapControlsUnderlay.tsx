import { Map, RefreshCcw } from '@dish/react-feather'
import React, { memo } from 'react'
import { AbsoluteVStack, HStack, useMedia } from 'snackui'

import { searchBarHeight, zIndexDrawer } from './constants'
import { isWeb } from './constants'
import { useMapSize } from './hooks/useMapSize'
import { useSafeArea } from './hooks/useSafeArea'
import { useOvermind } from './state/useOvermind'
import { OverlayLinkButton } from './views/ui/OverlayLinkButton'

export const AppMapControlsUnderlay = memo(() => {
  const om = useOvermind()
  const hasMovedMap =
    !!om.state.home.currentState.mapAt &&
    om.state.home.currentStateType === 'search'
  const media = useMedia()
  const { paddingLeft, width } = useMapSize(media.sm)
  const safeArea = useSafeArea()
  return (
    <AbsoluteVStack
      zIndex={media.sm ? zIndexDrawer - 1 : zIndexDrawer + 1}
      marginLeft="auto"
      fullscreen
      width={width}
      pointerEvents="none"
    >
      <AbsoluteVStack
        fullscreen
        paddingHorizontal={30}
        // top={searchBarHeight + 10}
        left={paddingLeft + 20}
        right={0}
        pointerEvents="none"
        {...(media.sm && {
          maxWidth: '100%',
          left: 0,
          right: 0,
          top: isWeb ? 0 : safeArea.top - 10,
        })}
        zIndex={20000000}
        alignItems="center"
        justifyContent="center"
      >
        <HStack
          position="absolute"
          top={media.sm ? 10 : searchBarHeight + 15}
          right={0}
          left={0}
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
          pointerEvents="none"
          // overflow="hidden"
          spacing={5}
        >
          {hasMovedMap && (
            <OverlayLinkButton
              Icon={RefreshCcw}
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
                alignItems="center"
                justifyContent="center"
                onPress={() => {
                  om.actions.home.setHoveredRestaurant(false)
                }}
              >
                Show all
              </OverlayLinkButton>
            )}

          {/* {hasMovedMap && zoomLevel !== 'medium' && (
            <OverlayLinkButton
              Icon={Map}
              pointerEvents="auto"
              alignItems="center"
              justifyContent="center"
              onPress={mapZoomToMedium}
            >
              Fit to results
            </OverlayLinkButton>
          )} */}
        </HStack>
      </AbsoluteVStack>
    </AbsoluteVStack>
  )
})
