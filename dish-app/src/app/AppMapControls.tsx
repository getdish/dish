import { isEqual } from '@dish/fast-compare'
import { RefreshCcw } from '@dish/react-feather'
import { useStoreInstance } from '@dish/use-store'
import React, { memo } from 'react'
import { AbsoluteVStack, HStack, Theme, useMedia } from 'snackui'

import { isWeb, searchBarHeight, zIndexDrawer } from '../constants/constants'
import { appMapStore } from './AppMapStore'
import { useHomeStore } from './homeStore'
import { useSafeArea } from './hooks/useSafeArea'
import { pagesStore } from './pagesStore'
import { OverlayLinkButton } from './views/OverlayLinkButton'

export const AppMapControls = memo(() => {
  const home = useHomeStore()
  const appMap = useStoreInstance(appMapStore)
  const hasMovedCenter =
    appMap.position.center &&
    !isEqual(appMap.position.center, home.currentState.center)
  const hasMovedSpan =
    appMap.position.span &&
    !isEqual(appMap.position.span, home.currentState.span)
  const hasMovedMap = hasMovedCenter || hasMovedSpan
  const showRefresh = hasMovedMap && home.currentStateType === 'search'
  const media = useMedia()
  const safeArea = useSafeArea()
  return (
    <Theme name="darkTranslucent">
      <AbsoluteVStack
        zIndex={media.sm ? zIndexDrawer - 1 : zIndexDrawer + 1}
        marginLeft="auto"
        fullscreen
        pointerEvents="none"
      >
        <AbsoluteVStack
          fullscreen
          paddingHorizontal={30}
          pointerEvents="none"
          {...(!isWeb && {
            top: safeArea.top - 10,
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
            {showRefresh && (
              <OverlayLinkButton Icon={RefreshCcw} onPress={pagesStore.refresh}>
                Search here
              </OverlayLinkButton>
            )}
          </HStack>
        </AbsoluteVStack>
      </AbsoluteVStack>
    </Theme>
  )
})

// {/* {om.state.home.hoveredRestaurant &&
//   om.state.home.currentStateType === 'search' && (
//     <OverlayLinkButton
//       Icon={Map}
//       onPress={() => {
//         om.actions.home.setHoveredRestaurant(false)
//       }}
//     >
//       Show all
//     </OverlayLinkButton>
//   )} */}

// {/* {hasMovedMap && zoomLevel !== 'medium' && (
//   <OverlayLinkButton
//     Icon={Map}
//     pointerEvents="auto"
//     alignItems="center"
//     justifyContent="center"
//     onPress={mapZoomToMedium}
//   >
//     Fit to results
//   </OverlayLinkButton>
// )} */}
