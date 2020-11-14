import { ArrowUp, Home } from '@dish/react-feather'
import { useStore } from '@dish/use-store'
import React, { memo, useLayoutEffect } from 'react'
import { AbsoluteVStack, Text } from 'snackui'

import { AppIntroLogin } from './AppIntroLogin'
// @ts-ignore
import { DarkModal } from './DarkModal'
import { IntroModal } from './IntroModal'
import { useOvermind } from './state/useOvermind'
import { UserOnboard } from './UserOnboard'
import { CloseButton, SmallCircleButton } from './views/ui/CloseButton'

export const AppIntroLetter = memo(() => {
  const om = useOvermind()
  const hasOnboarded = om.state.user.user?.has_onboarded
  const isLoggedIn = om.state.user.isLoggedIn
  const store = useStore(IntroModal)
  // const curPage = om.state.router.curPage
  // const isPublicPage = curPage.name === 'about' || curPage.name === 'blog'
  // make it private only
  // isPublicPage
  //   ? true
  //   : isLoggedIn
  //   ? closed
  //     ? true
  //     : hasOnboarded
  //   : false

  useLayoutEffect(() => {
    if (store.started) return
    if (!isLoggedIn || (isLoggedIn && !hasOnboarded)) {
      store.setHidden(false)
    }
  }, [store.hidden, isLoggedIn, hasOnboarded])

  if (isLoggedIn && hasOnboarded) {
    return null
  }

  return (
    <DarkModal
      hide={store.hidden}
      outside={
        <>
          <SmallCircleButton
            position="absolute"
            zIndex={1000}
            top={15}
            right={15}
            opacity={0.5}
            backgroundColor="transparent"
            padding={10}
            onPress={() => {
              store.setHidden(true)
            }}
          >
            <Home size={24} color="#fff" />
          </SmallCircleButton>
          <AbsoluteVStack
            bottom={-20}
            zIndex={1000}
            right={-20}
            transform={[{ rotate: '-10deg' }]}
          >
            <Text fontSize={70}>🌮</Text>
          </AbsoluteVStack>
          <AbsoluteVStack
            bottom={-20}
            zIndex={1000}
            left={-20}
            transform={[{ rotate: '10deg' }]}
          >
            <Text fontSize={70}>🍜</Text>
          </AbsoluteVStack>
        </>
      }
    >
      {!isLoggedIn && (
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
