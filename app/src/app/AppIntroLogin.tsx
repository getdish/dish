import { useStore } from '@dish/use-store'
import React, { memo } from 'react'
import { Paragraph, VStack, useTheme } from 'snackui'

import { AuthForm } from './AuthForm'
import { IntroModalStore } from './IntroModalStore'
import { userStore } from './userStore'
import { LinkButton } from './views/LinkButton'
import { LogoColor } from './views/Logo'

export const AppIntroLogin = memo(() => {
  const store = useStore(IntroModalStore)
  const theme = useTheme()

  return (
    <>
      <VStack
        overflow="hidden"
        borderRadius={20}
        paddingVertical={20}
        spacing="xl"
        alignItems="center"
        width="100%"
      >
        <LogoColor scale={1.8} />

        <Paragraph
          fontWeight="800"
          minWidth={280}
          size="lg"
          textAlign="center"
          position="relative"
          color={theme.colorTertiary}
          zIndex={1000}
        >
          pocket guide to the world
        </Paragraph>

        {!userStore.isLoggedIn && <AuthForm />}

        <LinkButton
          alignSelf="center"
          name="about"
          onPressOut={() => {
            store.setHidden(true)
          }}
        >
          about us
        </LinkButton>
      </VStack>
    </>
  )
})
