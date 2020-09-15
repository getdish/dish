import { AbsoluteVStack, HStack } from '@dish/ui'
import { useStore } from '@dish/use-store'
import loadable from '@loadable/component'
import React, { Suspense, memo } from 'react'

import { searchBarHeight, zIndexMapControls } from '../../constants'
import { getWindowHeight } from '../../helpers/getWindow'
import { useOvermind } from '../../state/om'
import { BottomDrawerStore } from './BottomDrawerStore'
import { HomeMapRestaurantPeek } from './HomeMapRestaurantPeek'
import { useIsNarrow, useIsReallyNarrow } from './useIs'
import { useMapSize } from './useMapSize'

export const HomeMapControlsOverlay = memo(() => {
  const om = useOvermind()
  const isReallySmall = useIsReallyNarrow()
  const isSmall = useIsNarrow()
  const { paddingLeft, width } = useMapSize(isSmall)
  const drawerStore = useStore(BottomDrawerStore)

  let bottom = 0
  if (om.state.home.drawerSnapPoint === 2) {
    bottom = getWindowHeight() - getWindowHeight() * drawerStore.snapPoints[2]
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

const HomeMapPIP =
  process.env.TARGET === 'ssr' ? null : loadable(() => import('./HomeMapPIP'))
