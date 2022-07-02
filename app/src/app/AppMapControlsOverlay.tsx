import { searchBarHeight, zIndexMapControls } from '../constants/constants'
import { getWindowHeight } from '../helpers/getWindow'
import { AppMapRestaurantPeek } from './AppMapRestaurantPeek'
import { drawerStore } from './drawerStore'
import { ReviewImagesRow } from './home/restaurant/ReviewImagesRow'
import { useMapSize } from './hooks/useMapSize'
import { AbsoluteYStack, XStack, YStack, useMedia } from '@dish/ui'
import { useStoreInstanceSelector } from '@dish/use-store'
import React, { Suspense, memo } from 'react'

export const AppMapControlsOverlay = memo(() => {
  const media = useMedia()
  const { paddingLeft, width } = useMapSize(media.sm)
  const isAtBottom = useStoreInstanceSelector(drawerStore, (x) => x.snapIndexName === 'bottom')
  let bottom = 0
  if (isAtBottom) {
    bottom = getWindowHeight() - getWindowHeight() * drawerStore.snapPoints[2]
  }

  return (
    <AbsoluteYStack
      zIndex={zIndexMapControls}
      marginLeft="auto"
      fullscreen
      width={width}
      pointerEvents="none"
    >
      <AbsoluteYStack
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
        <XStack position="absolute" bottom={0} right={0} left={0}>
          <XStack
            flexDirection="row-reverse"
            alignItems="flex-end"
            flex={1}
            overflow="hidden"
            justifyContent="space-between"
            flexWrap="wrap"
            paddingLeft={media.sm ? 10 : 30}
            paddingRight={15}
            // paddingBottom={media.xs ? edgeInsets.bottom + 15 : 15}
            paddingBottom={15}
            paddingTop={20}
          >
            {/* todo make loadable() if adding back in */}
            {/* <Suspense fallback={null}>
              <AppMapPIP />
            </Suspense> */}

            {!media.sm && (
              <>
                <Suspense fallback={null}>
                  <AppMapRestaurantPeek />
                </Suspense>
              </>
            )}

            <ReviewImagesRow
              floating
              showGenericImages
              isEditing
              imgWidth={66}
              imgHeight={66}
            />
          </XStack>

          <YStack flex={1} />
        </XStack>
      </AbsoluteYStack>
    </AbsoluteYStack>
  )
})

// DOWNLOAD APP ICON
// {/* {isWeb && (
//               <YStack>
//                 <Tooltip contents="Soon!">
//                   <YStack
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
//                   </YStack>
//                 </Tooltip>
//               </YStack>
//             )} */}
