import { Minus, Plus, RefreshCcw, X } from '@dish/react-feather'
import { useSelector, useStoreInstance, useStoreInstanceSelector } from '@dish/use-store'
import React, { memo } from 'react'
import {
  AbsoluteHStack,
  AbsoluteVStack,
  Theme,
  Tooltip,
  VStack,
  useMedia,
  useSafeAreaInsets,
} from 'snackui'

import { isWeb, zIndexDrawer } from '../constants/constants'
import { hasMovedAtLeast } from '../helpers/mapHelpers'
import { appMapStore } from './appMapStore'
import { getSearchPageStore } from './home/search/SearchPageStore'
import { homeStore } from './homeStore'
import { pagesStore } from './pagesStore'
import { OverlayLinkButton } from './views/OverlayLinkButton'

export const AppMapControls = memo(() => {
  const media = useMedia()
  const safeArea = useSafeAreaInsets()
  const showSearchHere = useShowSearchHere()
  const appMap = useStoreInstance(appMapStore)
  const isHoverZoomed = useStoreInstanceSelector(
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
          left={5}
          right={5}
          {...(!isWeb && {
            top: safeArea.top - 10,
          })}
          zIndex={20000000}
          alignItems="center"
          pointerEvents="none"
          justifyContent="center"
        >
          <AbsoluteHStack
            top={8}
            right={0}
            minHeight={50}
            left={0}
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
            pointerEvents="none"
            {...(media.notSm && {
              top: 'auto',
              bottom: 20,
            })}
          >
            {/* {isWeb && <ToggleRegionButton />} */}

            {!appMap.hideRegions && (
              <>
                <OverlayLinkButton
                  disabled={appMap.currentZoomLevel === 'far'}
                  Icon={Minus}
                  onPress={appMap.zoomOut}
                />
                <OverlayLinkButton
                  disabled={appMap.currentZoomLevel === 'close'}
                  Icon={Plus}
                  onPress={appMap.zoomIn}
                />
              </>
            )}

            {showSearchHere && (
              <OverlayLinkButton Icon={RefreshCcw} onPress={pagesStore.refresh}>
                {media.notSm ? 'Search' : null}
              </OverlayLinkButton>
            )}

            {/* <ToggleRegionButton /> */}

            {isHoverZoomed && (
              <OverlayLinkButton Icon={X} onPress={appMap.clearHover}>
                Clear hover
              </OverlayLinkButton>
            )}

            <VStack flex={media.sm ? 1 : 0} />
          </AbsoluteHStack>
        </AbsoluteVStack>
      </AbsoluteVStack>
    </Theme>
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
//       <HStack pointerEvents="none" alignItems="center" spacing="sm">
//         <Text userSelect="none" fontSize={12}>
//           Area
//         </Text>
//         <VStack scale={0.8}>
//           <Switch value={!searchRegion} />
//         </VStack>
//         <Text userSelect="none" fontSize={12}>
//           All
//         </Text>
//       </HStack>
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
