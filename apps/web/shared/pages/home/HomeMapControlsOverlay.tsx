// debug
import { AbsoluteVStack, HStack, useOverlay } from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { searchBarHeight, zIndexMapControls } from '../../constants'
import { useOvermind } from '../../state/useOvermind'
import { useMapSize } from './HomeMap'
import { HomeMapPIP } from './HomeMapPIP'
import { HomeMapRestaurantPeek } from './HomeMapRestaurantPeek'
import { snapPoints } from './HomeSmallDrawer'
import {
  useMediaQueryIsReallySmall,
  useMediaQueryIsSmall,
} from './useMediaQueryIs'

export const HomeMapControlsOverlay = memo(() => {
  const om = useOvermind()
  const isReallySmall = useMediaQueryIsReallySmall()
  const isSmall = useMediaQueryIsSmall()
  const { paddingLeft, width } = useMapSize(isSmall)

  let bottom = 0
  if (om.state.home.drawerSnapPoint === 2) {
    bottom = window.innerHeight - window.innerHeight * snapPoints[2]
  }

  return (
    <AbsoluteVStack
      zIndex={zIndexMapControls}
      marginLeft="auto"
      fullscreen
      width={width}
      pointerEvents="none"
    >
      <AbsoluteVStack
        className="ease-in-out-slower"
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
          bottom,
        })}
        zIndex={20000000}
        alignItems="center"
        justifyContent="center"
      >
        <HStack position="absolute" bottom={0} right={0} left={0}>
          <HStack
            flexDirection="row-reverse"
            alignItems="flex-end"
            flex={1}
            overflow="hidden"
            justifyContent="space-between"
            flexWrap="wrap"
            paddingLeft={isSmall ? 15 : 30}
            paddingRight={15}
            paddingBottom={15}
            paddingTop={20}
          >
            <Suspense fallback={null}>
              <HomeMapPIP />
            </Suspense>
            {!isReallySmall && <HomeMapRestaurantPeek />}
          </HStack>
        </HStack>
      </AbsoluteVStack>
    </AbsoluteVStack>
  )
})
