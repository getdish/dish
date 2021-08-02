import { useStore } from '@dish/use-store'
import React, { memo } from 'react'
import { Paragraph, VStack, useThemeName } from 'snackui'

import dishLogo from '../assets/dish-neon.jpg'
import { pinkPastel } from '../constants/colors'
import { AuthForm } from './AuthForm'
import { IntroModalStore } from './IntroModalStore'
import { Image } from './views/Image'
import { LinkButton } from './views/LinkButton'
import { LogoColor } from './views/Logo'

export const AppIntroLogin = memo(() => {
  const store = useStore(IntroModalStore)

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

        <Paragraph minWidth={280} size="lg" textAlign="center" position="relative" zIndex={1000}>
          pocket guide to the world
        </Paragraph>

        <AuthForm />

        <LinkButton
          textProps={{
            fontSize: 18,
            color: pinkPastel,
            fontWeight: '700',
          }}
          alignSelf="center"
          backgroundColor={`${pinkPastel}44`}
          hoverStyle={{
            backgroundColor: `${pinkPastel}66`,
          }}
          name="about"
          onPressOut={() => {
            store.setHidden(true)
          }}
        >
          learn more
        </LinkButton>
      </VStack>
    </>
  )
})
