import { isEqual } from '@dish/fast-compare'
import { RefreshCcw, X } from '@dish/react-feather'
import { useSelector, useStoreInstance } from '@dish/use-store'
import React, { memo } from 'react'
import { AbsoluteVStack, HStack, Theme, useMedia } from 'snackui'

import { isWeb, searchBarHeight, zIndexDrawer } from '../constants/constants'
import { hasMovedAtLeast } from '../helpers/hasMovedAtLeast'
import { appMapStore } from './AppMapStore'
import { searchPageStore } from './home/search/SearchPageStore'
import { homeStore, useHomeStore, useIsHomeTypeActive } from './homeStore'
import { useSafeArea } from './hooks/useSafeArea'
import { pagesStore } from './pagesStore'
import { OverlayLinkButton } from './views/OverlayLinkButton'

export const AppMapControls = memo(() => {
  const media = useMedia()
  const safeArea = useSafeArea()
  const showSearchHere = useShowSearchHere()
  const isHoverZoomed = useStoreInstance(
    appMapStore,
    (x) => !!x.hovered && x.zoomOnHover
  )
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
          >
            {showSearchHere && (
              <OverlayLinkButton Icon={RefreshCcw} onPress={pagesStore.refresh}>
                Search here
              </OverlayLinkButton>
            )}

            {isHoverZoomed && (
              <OverlayLinkButton Icon={X} onPress={appMapStore.clearHover}>
                Clear hover
              </OverlayLinkButton>
            )}
          </HStack>
        </AbsoluteVStack>
      </AbsoluteVStack>
    </Theme>
  )
})

function useShowSearchHere() {
  return useSelector(() => {
    const isOnSearch = homeStore.currentStateType === 'search'
    const sp = searchPageStore.searchPosition
    const { center, span } = appMapStore.nextPosition
    if (searchPageStore.status === 'loading') return false
    if (!isOnSearch) return false
    const hasMoved = hasMovedAtLeast(sp, { center, span }, 0.02)
    return hasMoved
  })
}

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
