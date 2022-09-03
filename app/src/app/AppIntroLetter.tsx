import { useRouterCurPage } from '../router'
import { AppIntroLogin } from './AppIntroLogin'
import { IntroModalStore } from './IntroModalStore'
import { UserOnboard } from './UserOnboard'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { useUserStore } from './userStore'
import { SmallCircleButton } from './views/CloseButton'
import { DarkModal } from './views/DarkModal'
import { AbsoluteYStack, Text } from '@dish/ui'
import { useStore } from '@dish/use-store'
import { Home } from '@tamagui/feather-icons'
import React, { memo, useLayoutEffect } from 'react'

export const AppIntroLetter = memo(() => {
  const userStore = useUserStore()
  const [closes = 0 as number, setCloses] = useLocalStorageState('modal-intro-closes', 0)
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

  return null

  return (
    <DarkModal
      hide={store.hidden}
      onDismiss={store.setHidden}
      outside={
        <>
          <SmallCircleButton
            position="absolute"
            icon={Home}
            zIndex={1000}
            top={15}
            right={15}
            size="$6"
            onPress={() => {
              setCloses(closes + 1)
              store.setHidden(true)
            }}
          />
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
