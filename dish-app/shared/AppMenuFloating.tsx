import { Menu } from '@dish/react-feather'
import { AbsoluteVStack, BlurView, HStack, Modal, VStack } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React from 'react'

import { AppMenuContents } from './AppMenuContents'
import { zIndexMapControls } from './constants'
import { useIsReallyNarrow } from './hooks/useIs'
import { useSafeArea } from './hooks/useSafeArea'
import { useSearchBarTheme } from './hooks/useSearchBarTheme'

class UserMenuStore extends Store {
  show = false

  toggle() {
    this.show = !this.show
  }

  setShow(val: boolean) {
    this.show = val
  }
}

export const AppMenuFloating = () => {
  const isReallySmall = useIsReallyNarrow()
  const userMenu = useStore(UserMenuStore)
  const safeArea = useSafeArea()
  const { color } = useSearchBarTheme()

  if (!isReallySmall) {
    return null
  }

  return (
    <>
      <Modal
        visible={userMenu.show}
        presentationStyle="formSheet"
        overlayDismisses
        onDismiss={() => {
          userMenu.setShow(false)
        }}
        onRequestClose={() => {
          userMenu.setShow(false)
        }}
      >
        <AppMenuContents
          flex={1}
          hideUserMenu={() => userMenu.setShow(false)}
        />
      </Modal>
      <AbsoluteVStack
        top={safeArea.top ? safeArea.top : 15}
        right={15}
        zIndex={zIndexMapControls + 1}
        pointerEvents="none"
      >
        <VStack
          shadowColor="rgba(0,0,0,0.095)"
          shadowRadius={4}
          shadowOffset={{ height: 3, width: 0 }}
          pointerEvents="auto"
          borderRadius={100}
          onPress={() => {
            userMenu.toggle()
          }}
        >
          <BlurView borderRadius={24}>
            <HStack
              width={44}
              height={44}
              alignItems="center"
              justifyContent="center"
              borderRadius={100}
            >
              <Menu color={color} size={22} />
            </HStack>
          </BlurView>
        </VStack>
      </AbsoluteVStack>
    </>
  )
}
