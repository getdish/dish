import { Menu } from '@dish/react-feather'
import { useStoreInstance } from '@dish/use-store'
import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { AbsoluteVStack, BlurView, HStack, Modal, VStack, useMedia } from 'snackui'

import { zIndexDrawer } from '../constants/constants'
import { AppMenuContents } from './AppMenuContents'
import { appMenuStore } from './AppMenuStore'
import { useSafeArea } from './hooks/useSafeArea'
import { CloseButton } from './views/CloseButton'

export const AppMenuButton = () => {
  const media = useMedia()
  const appMenu = useStoreInstance(appMenuStore)
  const safeArea = useSafeArea()

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
        <TouchableWithoutFeedback
          // for bug which prevents dismiss from firing on swipe close
          // https://github.com/facebook/react-native/issues/26892
          onPressOut={appMenu.hide}
        >
          <AppMenuContents flex={1} hideUserMenu={appMenu.hide} />
        </TouchableWithoutFeedback>
        <AbsoluteVStack top={10} right={10}>
          <CloseButton onPress={appMenu.hide} />
        </AbsoluteVStack>
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
          transform={[{ scale: 1.0001 }]}
          hoverStyle={{
            // backgroundColor: 'rgba(0,0,0,0.5)',
            transform: [{ scale: 1.05 }],
          }}
          pressStyle={{
            transform: [{ scale: 0.95 }],
          }}
          onPress={appMenu.show}
        >
          <BlurView borderRadius={24} fallbackBackgroundColor="rgba(0,0,0,0.5)">
            <HStack
              width={50}
              height={50}
              alignItems="center"
              justifyContent="center"
              borderRadius={100}
            >
              <Menu color="#fff" size={24} />
            </HStack>
          </BlurView>
        </VStack>
      </AbsoluteVStack>
    </>
  )
}
