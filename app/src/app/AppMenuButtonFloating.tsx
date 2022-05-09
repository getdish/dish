// @ts-nocheck
import { zIndexDrawer } from '../constants/constants'
import { AppMenuContents } from './AppMenuContents'
import { appMenuStore } from './AppMenuStore'
import { CloseButton } from './views/CloseButton'
import { PaneControlButtons } from './views/PaneControlButtons'
import { AbsoluteYStack, Button, Modal, YStack, useMedia, useSafeAreaInsets } from '@dish/ui'
import { useStoreInstance } from '@dish/use-store'
import { Menu } from '@tamagui/feather-icons'
import React, { memo } from 'react'

export const AppMenuButtonFloating = memo(() => {
  const media = useMedia()
  const appMenu = useStoreInstance(appMenuStore)
  const safeArea = useSafeAreaInsets()

  if (!(media.sm || media.xs)) {
    return null
  }

  return (
    <>
      <Modal
        visible={appMenu.isVisible}
        animationType="slide"
        hardwareAccelerated
        presentationStyle="pageSheet"
        onDismiss={appMenu.hide}
        onRequestClose={appMenu.hide}
      >
        {/* this causes every tap to close on web */}
        {/* <TouchableWithoutFeedback
          // for bug which prevents dismiss from firing on swipe close
          // https://github.com/facebook/react-native/issues/26892
          onPressOut={appMenu.hide}
        > */}
        {appMenu.isVisible && (
          <AppMenuContents
            width="100%"
            minHeight="100%"
            py="$6"
            flex={1}
            hideUserMenu={appMenu.hide}
          />
        )}
        {/* </TouchableWithoutFeedback> */}
        <PaneControlButtons>
          <CloseButton onPress={appMenu.hide} />
        </PaneControlButtons>
      </Modal>
      <AbsoluteYStack
        top={safeArea.top ? safeArea.top : 10}
        right={10}
        zIndex={zIndexDrawer - 1}
        // pointerEvents="none"
      >
        <Button
          pointerEvents="auto"
          elevation="$2"
          shop={0.2}
          size="$5"
          icon={Menu}
          circular
          overflow="visible"
          onPress={appMenu.show}
        />

        {/* <YStack
          // className="ease-in-out-faster"
          shadowColor="rgba(0,0,0,0.25)"
          shadowRadius={6}
          shadowOffset={{ height: 3, width: 0 }}
          pointerEvents="auto"
          borderRadius={100}
          backgroundColor="rgba(0,0,0,0.5)"
          scale={1.0001}
          hoverStyle={{
            scale: 1.05,
          }}
          pressStyle={{
            scale: 0.95,
          }}
          onPress={appMenu.show}
        >
          <XStack
            width={50}
            height={50}
            alignItems="center"
            justifyContent="center"
            borderRadius={100}
          >
            {user.user ? (
              <UserAvatar size={40} avatar={user.user?.avatar} charIndex={user.user?.charIndex} />
            ) : (
              <Menu color="#fff" size={24} />
            )}
          </XStack>
        </YStack> */}
      </AbsoluteYStack>
    </>
  )
})
