import { Menu } from '@dish/react-feather'
import { useStoreInstance } from '@dish/use-store'
import React from 'react'
import {
  AbsoluteVStack,
  BlurView,
  HStack,
  Modal,
  VStack,
  useMedia,
} from 'snackui'

import { zIndexDrawer } from '../constants/constants'
import { AppMenuContents } from './AppMenuContents'
import { appMenuStore } from './AppMenuStore'
import { useSafeArea } from './hooks/useSafeArea'

export const AppMenuButton = () => {
  const media = useMedia()
  const appMenu = useStoreInstance(appMenuStore)
  const safeArea = useSafeArea()

  if (!media.xs) {
    return null
  }

  return (
    <>
      <Modal
        visible={appMenu.isVisible}
        presentationStyle="formSheet"
        overlayDismisses
        onDismiss={appMenu.hide}
        onRequestClose={appMenu.hide}
      >
        <AppMenuContents flex={1} hideUserMenu={appMenu.hide} />
      </Modal>
      <AbsoluteVStack
        top={safeArea.top ? safeArea.top : 10}
        right={10}
        zIndex={zIndexDrawer - 1}
        pointerEvents="none"
      >
        <VStack
          className="ease-in-out-fast"
          shadowColor="rgba(0,0,0,0.095)"
          shadowRadius={4}
          shadowOffset={{ height: 3, width: 0 }}
          pointerEvents="auto"
          borderRadius={100}
          backgroundColor="rgba(0,0,0,0.1)"
          hoverStyle={{
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
          pressStyle={{
            transform: [{ scale: 0.9 }],
          }}
          onPress={appMenu.show}
        >
          <BlurView
            borderRadius={24}
            fallbackBackgroundColor="rgba(255,255,255,0.9)"
          >
            <HStack
              width={50}
              height={50}
              alignItems="center"
              justifyContent="center"
              borderRadius={100}
            >
              <Menu color="#000" size={24} />
            </HStack>
          </BlurView>
        </VStack>
      </AbsoluteVStack>
    </>
  )
}
