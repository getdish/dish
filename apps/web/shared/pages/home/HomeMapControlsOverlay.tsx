import { AbsoluteVStack, Box, HStack, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { ChevronUp, Map, RefreshCcw, ZoomOut } from 'react-feather'

import { searchBarHeight } from '../../constants'
import { useOvermind } from '../../state/useOvermind'
import { OverlayLinkButton } from '../../views/ui/OverlayLinkButton'
import { HomeMapRestaurantPeek } from './HomeMapRestaurantPeek'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const HomeMapControlsOverlay = memo(
  ({ paddingLeft }: { paddingLeft: number }) => {
    const om = useOvermind()
    const hasMovedMap = om.state.home.currentState?.['hasMovedMap']
    const isSmall = useMediaQueryIsSmall()
    return (
      <AbsoluteVStack
        fullscreen
        padding={20}
        pointerEvents="none"
        top={searchBarHeight + 10}
        left={paddingLeft}
        maxWidth={600}
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
          spacing={20}
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
        </HStack>

        <HStack
          position="absolute"
          bottom={15}
          right={0}
          left={30}
          alignItems="flex-end"
        >
          {!isSmall && <HomeMapRestaurantPeek />}
          <VStack flex={1} />
        </HStack>
      </AbsoluteVStack>
    )
  }
)
