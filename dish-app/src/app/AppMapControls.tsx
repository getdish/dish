import { RefreshCcw, X } from '@dish/react-feather'
import { useSelector, useStoreInstance } from '@dish/use-store'
import { useDebugStoreComponent } from '@dish/use-store/src/useStoreDebug'
import React, { memo } from 'react'
import { Switch } from 'react-native'
import { AbsoluteVStack, HStack, Text, Theme, VStack, useMedia } from 'snackui'

import { isWeb, searchBarHeight, zIndexDrawer } from '../constants/constants'
import { hasMovedAtLeast } from '../helpers/mapHelpers'
import { useIsRouteActive } from '../router'
import { appMapStore } from './AppMapStore'
import {
  searchPageStore,
  useSearchPageStore,
} from './home/search/SearchPageStore'
import { homeStore } from './homeStore'
import { useSafeArea } from './hooks/useSafeArea'
import { pagesStore } from './pagesStore'
import { OverlayLinkButton } from './views/OverlayLinkButton'

export const AppMapControls = memo(() => {
  const media = useMedia()
  const safeArea = useSafeArea()
  const showSearchHere = useShowSearchHere()
  const isHoverZoomed = useStoreInstance(
    appMapStore,
    (x) => x.hovered?.via === 'list' && x.zoomOnHover
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
            <ToggleRegionButton />

            {showSearchHere && (
              <OverlayLinkButton
                Icon={RefreshCcw}
                onPress={pagesStore.refresh}
              />
            )}

            {isHoverZoomed && (
              <OverlayLinkButton Icon={X} onPress={appMapStore.clearHover}>
                Clear hover
              </OverlayLinkButton>
            )}

            <VStack flex={media.sm ? 1 : 0} />
          </HStack>
        </AbsoluteVStack>
      </AbsoluteVStack>
    </Theme>
  )
})

const ToggleRegionButton = memo(() => {
  const { searchRegion, toggleSearchRegion } = useSearchPageStore()
  const isOnSearch = useIsRouteActive('search')
  if (!isOnSearch) {
    return null
  }
  return (
    <OverlayLinkButton onPress={toggleSearchRegion}>
      <HStack pointerEvents="none" alignItems="center" spacing="sm">
        <Text userSelect="none" fontSize={12}>
          Area
        </Text>
        <VStack transform={[{ scale: 0.8 }]}>
          <Switch value={!searchRegion} />
        </VStack>
        <Text userSelect="none" fontSize={12}>
          All
        </Text>
      </HStack>
    </OverlayLinkButton>
  )
})

function useShowSearchHere() {
  return useSelector(() => {
    const isOnSearch = homeStore.currentStateType === 'search'
    const sp = searchPageStore.searchPosition
    const { center, span } = appMapStore.nextPosition
    if (searchPageStore.status === 'loading') return false
    if (!isOnSearch) return false
    const hasMoved = hasMovedAtLeast(sp, { center, span })
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
