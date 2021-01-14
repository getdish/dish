import { useStore } from '@dish/use-store'
import React, { memo } from 'react'
import { Image } from 'react-native'
import { Paragraph, Spacer, Text, VStack } from 'snackui'

import dishLogo from '../assets/dish-neon.jpg'
import { lightYellow, pinkPastel } from '../constants/colors'
import { AuthForm } from './AuthForm'
import { IntroModalStore } from './IntroModalStore'
import { LinkButton } from './views/LinkButton'

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
        <Image
          source={{ uri: dishLogo }}
          style={{
            marginBottom: -30,
            width: 892 * 0.25,
            height: 492 * 0.25,
            // transform: [{ rotate: '6deg' }],
            zIndex: -2,
            position: 'relative',
          }}
        />

        <Paragraph
          color="#E2A5D9"
          paddingHorizontal="3%"
          maxWidth={320}
          fontWeight="300"
          size="lg"
          textAlign="center"
        >
          your pocket guide to the world
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
