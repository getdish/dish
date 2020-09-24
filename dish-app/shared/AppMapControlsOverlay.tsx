import { AbsoluteVStack, HStack, Tooltip, VStack } from '@dish/ui'
import { useStore } from '@dish/use-store'
import loadable from '@loadable/component'
import React, { Suspense, memo } from 'react'
import { Image } from 'react-native'

import { AppMapRestaurantPeek } from './AppMapRestaurantPeek'
import DownloadAppIcon from './assets/download-app-ios.svg'
import { BottomDrawerStore } from './BottomDrawerStore'
import { isWeb } from './constants'
import { searchBarHeight, zIndexMapControls } from './constants'
import { getWindowHeight } from './helpers/getWindow'
import { useIsNarrow, useIsReallyNarrow } from './hooks/useIs'
import { useMapSize } from './hooks/useMapSize'
import { useOvermind } from './state/om'

export const AppMapControlsOverlay = memo(() => {
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
            paddingRight={isReallySmall ? 20 : 15}
            paddingBottom={isReallySmall ? 60 : 15}
            paddingTop={20}
          >
            <Suspense fallback={null}>
              <HomeMapPIP />
            </Suspense>
            {!isReallySmall && <AppMapRestaurantPeek />}

            {isWeb && (
              <VStack>
                <Tooltip contents="Soon!">
                  <VStack
                    pointerEvents="auto"
                    opacity={0.6}
                    alignSelf="flex-end"
                    borderRadius={6}
                    shadowColor="rgba(0,0,0,0.35)"
                    shadowRadius={20}
                    shadowOffset={{ height: 3, width: 0 }}
                    marginVertical={5}
                    marginHorizontal={15}
                    overflow="hidden"
                  >
                    <Image
                      source={{ uri: DownloadAppIcon }}
                      style={{
                        width: 119.66407,
                        height: 40,
                        margin: -1.5,
                      }}
                    />
                  </VStack>
                </Tooltip>
              </VStack>
            )}
          </HStack>
        </HStack>
      </AbsoluteVStack>
    </AbsoluteVStack>
  )
})

const HomeMapPIP =
  process.env.TARGET === 'ssr' ? null : loadable(() => import('./AppMapPIP'))
