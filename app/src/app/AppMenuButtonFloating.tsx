import { zIndexDrawer } from '../constants/constants'
import { AppMenuContents } from './AppMenuContents'
import { appMenuStore } from './AppMenuStore'
import { AbsoluteYStack, Button, ThemeInverse, useMedia } from '@dish/ui'
import { useStoreInstance } from '@dish/use-store'
import { Menu } from '@tamagui/feather-icons'
import { Sheet } from '@tamagui/sheet'
import React, { memo } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const AppMenuButtonFloating = memo(() => {
  const media = useMedia()
  const appMenu = useStoreInstance(appMenuStore)
  const safeArea = useSafeAreaInsets()

  if (!(media.sm || media.xs)) {
    return null
  }

  return (
    <>
      <Sheet
        modal
        open={appMenu.isVisible}
        position={0}
        onChangeOpen={(open) => {
          console.log('changed open', open)
          appMenu.setIsVisible(open)
        }}
        dismissOnOverlayPress
        dismissOnSnapToBottom
        snapPoints={[80]}
      >
        <Sheet.Overlay />
        <Sheet.Frame>
          {/* this causes every tap to close on web */}
          <AppMenuContents
            width="100%"
            minHeight="100%"
            flex={1}
            hideUserMenu={appMenu.hide}
          />
        </Sheet.Frame>
      </Sheet>

      <AbsoluteYStack
        top={safeArea.top ? safeArea.top : 10}
        right={10}
        zIndex={zIndexDrawer - 1}
      >
        <ThemeInverse>
          <Button
            pointerEvents="auto"
            elevation="$3"
            shop={0.2}
            size="$5"
            icon={Menu}
            circular
            chromeless
            overflow="visible"
            onPress={appMenu.toggle}
          />
        </ThemeInverse>
      </AbsoluteYStack>
    </>
  )
})
