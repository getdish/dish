import { useStoreInstance } from '@dish/use-store'
import loadable from '@loadable/component'
import React, { Suspense, memo } from 'react'
import { AbsoluteVStack, HStack, useMedia } from 'snackui'

import { AppMapRestaurantPeek } from './AppMapRestaurantPeek'
import { drawerStore } from './BottomDrawerStore'
import { searchBarHeight, zIndexMapControls } from './constants'
import { getWindowHeight } from './helpers/getWindow'
import { useMapSize } from './hooks/useMapSize'
import { useSafeArea } from './hooks/useSafeArea'
import { useOvermind } from './state/useOvermind'

export const AppMapControlsOverlay = memo(() => {
  const om = useOvermind()
  const media = useMedia()
  const { paddingLeft, width } = useMapSize(media.sm)
  const drawer = useStoreInstance(drawerStore)
  const edgeInsets = useSafeArea()

  let bottom = 0
  if (drawer.snapIndex === 2) {
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
        {...(media.sm && {
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
            paddingLeft={media.sm ? 10 : 30}
            paddingRight={15}
            paddingBottom={media.xs ? edgeInsets.bottom + 15 : 15}
            paddingTop={20}
          >
            <Suspense fallback={null}>
              <AppMapPIP />
            </Suspense>

            {!media.sm && (
              <>
                <Suspense fallback={null}>
                  <AppMapRestaurantPeek />
                </Suspense>
              </>
            )}
          </HStack>
        </HStack>
      </AbsoluteVStack>
    </AbsoluteVStack>
  )
})

// DOWNLOAD APP ICON
// {/* {isWeb && (
//               <VStack>
//                 <Tooltip contents="Soon!">
//                   <VStack
//                     pointerEvents="auto"
//                     opacity={0.6}
//                     alignSelf="flex-end"
//                     borderRadius={6}
//                     shadowColor="rgba(0,0,0,0.35)"
//                     shadowRadius={20}
//                     shadowOffset={{ height: 3, width: 0 }}
//                     marginVertical={5}
//                     marginHorizontal={15}
//                     overflow="hidden"
//                   >
//                     <Image
//                       source={{ uri: DownloadAppIcon }}
//                       style={{
//                         width: 119.66407,
//                         height: 40,
//                         margin: -1.5,
//                       }}
//                     />
//                   </VStack>
//                 </Tooltip>
//               </VStack>
//             )} */}

const AppMapPIP =
  process.env.TARGET === 'ssr'
    ? () => null
    : loadable(() => import('./AppMapPIP'))
