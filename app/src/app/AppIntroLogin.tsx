import { useStore } from '@dish/use-store'
import React, { memo } from 'react'
import { Spacer, VStack, useTheme } from 'snackui'

import { AuthForm } from './AuthForm'
import { IntroModalStore } from './IntroModalStore'
import { TagLine } from './TagLine'
import { userStore } from './userStore'
import { LinkButton } from './views/LinkButton'
import { LogoColor } from './views/Logo'

export const AppIntroLogin = memo(() => {
  const store = useStore(IntroModalStore)

  return (
    <>
      <VStack overflow="hidden" borderRadius={20} padding={30} alignItems="center">
        <LogoColor scale={2} />
        <TagLine />

        {!userStore.isLoggedIn && (
          <>
            <Spacer />
            <AuthForm />
          </>
        )}

        <Spacer size="xxl" />

        <LinkButton
          alignSelf="center"
          name="about"
          onPressOut={() => {
            store.setHidden(true)
          }}
        >
          about us
        </LinkButton>

        <Spacer />
      </VStack>
    </>
  )
})
