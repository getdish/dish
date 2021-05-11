import { useStore } from '@dish/use-store'
import React, { memo } from 'react'
import { Image } from 'react-native'
import { Paragraph, VStack, useThemeName } from 'snackui'

import dishLogo from '../assets/dish-neon.jpg'
import { pinkPastel } from '../constants/colors'
import { AuthForm } from './AuthForm'
import { IntroModalStore } from './IntroModalStore'
import { LinkButton } from './views/LinkButton'
import { LogoColor } from './views/Logo'

export const AppIntroLogin = memo(() => {
  const store = useStore(IntroModalStore)
  const themeName = useThemeName()

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
        {themeName == 'dark' ? (
          <Image
            source={{ uri: dishLogo }}
            style={{
              marginBottom: -30,
              width: 892 * 0.25,
              height: 492 * 0.25,
              zIndex: 0,
              position: 'relative',
            }}
          />
        ) : (
          <LogoColor scale={2} />
        )}

        <Paragraph
          paddingHorizontal="3%"
          minWidth={280}
          fontWeight="800"
          size="lg"
          textAlign="center"
        >
          pocket guide to the world
        </Paragraph>

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

        <AuthForm />
      </VStack>
    </>
  )
})
