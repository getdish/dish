import { Menu } from '@dish/react-feather'
import { useStoreInstance } from '@dish/use-store'
import React, { memo } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { AbsoluteVStack, BlurView, HStack, Modal, VStack, useMedia } from 'snackui'

import { zIndexDrawer } from '../constants/constants'
import { AppMenuContents } from './AppMenuContents'
import { appMenuStore } from './AppMenuStore'
import { UserAvatar } from './home/user/UserAvatar'
import { useSafeArea } from './hooks/useSafeArea'
import { useUserStore } from './userStore'
import { CloseButton } from './views/CloseButton'
import { PaneControlButtons } from './views/PaneControlButtons'

export const AppMenuButtonFloating = memo(() => {
  const media = useMedia()
  const appMenu = useStoreInstance(appMenuStore)
  const safeArea = useSafeArea()
  const user = useUserStore()

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
        {appMenu.isVisible && <AppMenuContents flex={1} hideUserMenu={appMenu.hide} />}
        {/* </TouchableWithoutFeedback> */}
        <PaneControlButtons>
          <CloseButton onPress={appMenu.hide} />
        </PaneControlButtons>
      </Modal>
      <AbsoluteVStack
        top={safeArea.top ? safeArea.top : 10}
        right={10}
        zIndex={zIndexDrawer - 1}
        pointerEvents="none"
      >
        <VStack
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
          <HStack
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
          </HStack>
        </VStack>
      </AbsoluteVStack>
    </>
  )
})
