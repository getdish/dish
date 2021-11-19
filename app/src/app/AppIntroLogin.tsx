import { Spacer, YStack, useTheme } from '@dish/ui'
import { useStore } from '@dish/use-store'
import React, { memo } from 'react'

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
      <YStack overflow="hidden" borderRadius={20} padding={30} alignItems="center" spacing="md">
        <LogoColor scale={1.4} />
        <TagLine />
        {!userStore.isLoggedIn && (
          <>
            <Spacer />
            <AuthForm />
          </>
        )}

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
      </YStack>
    </>
  )
})
