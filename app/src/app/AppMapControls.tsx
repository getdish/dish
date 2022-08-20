import { zIndexDrawer } from '../constants/constants'
import { hasMovedAtLeast } from '../helpers/mapHelpers'
import { appMapStore } from './appMapStore'
import { getSearchPageStore } from './home/search/SearchPageStore'
import { homeStore } from './homeStore'
import { pagesStore } from './pagesStore'
import { OverlayLinkButton } from './views/OverlayLinkButton'
import { AbsoluteXStack, AbsoluteYStack, Spacer, XStack } from '@dish/ui'
import { useSelector, useStoreInstance, useStoreInstanceSelector } from '@dish/use-store'
import { Minus, Plus, RefreshCcw, ZoomOut } from '@tamagui/feather-icons'
import React, { memo } from 'react'

// import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const AppMapControls = memo(() => {
  const showSearchHere = useShowSearchHere()
  const appMap = useStoreInstance(appMapStore)
  // const safeArea = useSafeAreaInsets()
  const isHoverZoomed = useStoreInstanceSelector(
    appMapStore,
    (x) => x.hovered?.via === 'list' && x.zoomOnHover
  )

  return (
    <XStack space="$2" h="100%" ai="center" w="100%">
      {/* {isWeb && <ToggleRegionButton />} */}

      {!appMap.hideRegions && (
        <>
          <OverlayLinkButton
            circular
            disabled={appMap.currentZoomLevel === 'far'}
            icon={Minus}
            onPress={appMap.zoomOut}
          />
          <Spacer size="$2" />
          <OverlayLinkButton
            circular
            disabled={appMap.currentZoomLevel === 'close'}
            icon={Plus}
            onPress={appMap.zoomIn}
          />
        </>
      )}

      {showSearchHere && <OverlayLinkButton icon={RefreshCcw} onPress={pagesStore.refresh} />}

      {/* <ToggleRegionButton /> */}

      {isHoverZoomed && <OverlayLinkButton icon={ZoomOut} onPress={appMap.clearHover} />}

      <Spacer flex />
    </XStack>
  )
})

// const ToggleRegionButton = memo(() => {
//   const { searchRegion, toggleSearchRegion } = useSearchPageStore()
//   const isOnSearch = useIsRouteActive('search')
//   if (!isOnSearch) {
//     return null
//   }
//   return (
//     <OverlayLinkButton onPress={toggleSearchRegion}>
//       <XStack pointerEvents="none" alignItems="center" space="$2">
//         <Text userSelect="none" fontSize={12}>
//           Area
//         </Text>
//         <YStack scale={0.8}>
//           <Switch value={!searchRegion} />
//         </YStack>
//         <Text userSelect="none" fontSize={12}>
//           All
//         </Text>
//       </XStack>
//     </OverlayLinkButton>
//   )
// })

function useShowSearchHere() {
  return useSelector(() => {
    const searchPageStore = getSearchPageStore()
    if (!searchPageStore) return
    const isOnSearch = homeStore.currentStateType === 'search'
    const sp = searchPageStore.searchPosition
    const { center, span } = appMapStore.nextPosition
    if (searchPageStore.status === 'loading') return false
    if (!isOnSearch) return false
    const hasMoved = hasMovedAtLeast(sp, { center, span }, 0.001)
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
