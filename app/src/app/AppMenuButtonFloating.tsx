import { zIndexDrawer } from '../constants/constants'
import { AppMenuContents } from './AppMenuContents'
import { appMenuStore } from './AppMenuStore'
import { AbsoluteYStack, Button, useMedia } from '@dish/ui'
import { useStoreInstance } from '@dish/use-store'
import { Drawer } from '@tamagui/drawer'
import { Menu } from '@tamagui/feather-icons'
import React, { memo } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const AppMenuButtonFloating = memo(() => {
  const media = useMedia()
  const appMenu = useStoreInstance(appMenuStore)
  const { height } = useWindowDimensions()
  const drawerHeight = height * 0.8
  const safeArea = useSafeAreaInsets()

  if (!(media.sm || media.xs)) {
    return null
  }

  return (
    <>
      <Drawer
        open={appMenu.isVisible}
        onChangeOpen={(open) => {
          console.log('changed open', open)
          appMenu.setIsVisible(open)
        }}
        onDismiss={appMenu.hide}
        snapPoints={[drawerHeight]}
      >
        <Drawer.Frame maxHeight={drawerHeight} height={drawerHeight} p={0}>
          {/* this causes every tap to close on web */}
          <AppMenuContents
            width="100%"
            minHeight="100%"
            flex={1}
            hideUserMenu={appMenu.hide}
          />
          {/* <PaneControlButtons>
            <CloseButton onPress={appMenu.hide} />
          </PaneControlButtons> */}
        </Drawer.Frame>
      </Drawer>

      <AbsoluteYStack
        top={safeArea.top ? safeArea.top : 10}
        right={10}
        zIndex={zIndexDrawer - 1}
        // pointerEvents="none"
      >
        <Button
          pointerEvents="auto"
          elevation="$3"
          shop={0.2}
          size="$6"
          icon={Menu}
          circular
          overflow="visible"
          onPress={appMenu.toggle}
        />
      </AbsoluteYStack>
    </>
  )
})
