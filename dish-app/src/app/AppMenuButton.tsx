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
          className="ease-in-out-faster"
          shadowColor="rgba(0,0,0,0.25)"
          shadowRadius={6}
          shadowOffset={{ height: 3, width: 0 }}
          pointerEvents="auto"
          borderRadius={100}
          backgroundColor="rgba(255,255,255,0.85)"
          hoverStyle={{
            backgroundColor: 'rgba(255,255,255,1)',
            transform: [{ scale: 1.1 }],
          }}
          pressStyle={{
            transform: [{ scale: 0.94 }],
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
