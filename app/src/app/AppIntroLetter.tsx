import { Home } from '@dish/react-feather'
import { useStore } from '@dish/use-store'
import React, { memo, useLayoutEffect } from 'react'
import { AbsoluteVStack, Text } from 'snackui'

import { useRouterCurPage } from '../router'
import { AppIntroLogin } from './AppIntroLogin'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { IntroModalStore } from './IntroModalStore'
import { UserOnboard } from './UserOnboard'
import { useUserStore } from './userStore'
import { SmallCircleButton } from './views/CloseButton'
import { DarkModal } from './views/DarkModal'

export const AppIntroLetter = memo(() => {
  const userStore = useUserStore()
  const [closes, setCloses] = useLocalStorageState('modal-intro-closes', 0)
  const hasOnboarded = userStore.user?.has_onboarded
  const isLoggedIn = userStore.isLoggedIn
  const store = useStore(IntroModalStore)
  const curPage = useRouterCurPage()
  const isPasswordReset = curPage.name == 'passwordReset'

  useLayoutEffect(() => {
    if (store.started) return
    if (closes >= 3) {
      store.setHidden(true)
      return
    }
    if (!isLoggedIn || (isLoggedIn && !hasOnboarded)) {
      store.setHidden(false)
    }
  }, [closes, store.hidden, isLoggedIn, hasOnboarded])

  if (isLoggedIn && hasOnboarded) {
    return null
  }

  return (
    <DarkModal
      hide={store.hidden}
      onDismiss={store.setHidden}
      outside={
        <>
          <SmallCircleButton
            position="absolute"
            icon={<Home size={42} color="rgba(255,255,255,0.5)" />}
            zIndex={1000}
            top={15}
            right={15}
            size={48}
            hoverStyle={{
              backgroundColor: 'rgba(255,255,255,0.3)',
            }}
            onPress={() => {
              setCloses(closes + 1)
              store.setHidden(true)
            }}
          />
          <AbsoluteVStack bottom={-50} zIndex={1000} right={-40} rotate="-10deg">
            <Text fontSize={100}>🌮</Text>
          </AbsoluteVStack>
          <AbsoluteVStack bottom={-50} zIndex={1000} left={-40} rotate="10deg">
            <Text fontSize={100}>🍜</Text>
          </AbsoluteVStack>
        </>
      }
    >
      {!isLoggedIn && !isPasswordReset && (
        <>
          <AppIntroLogin />
        </>
      )}
      {isLoggedIn && !hasOnboarded && (
        <>
          <UserOnboard />
        </>
      )}
    </DarkModal>
  )
})
