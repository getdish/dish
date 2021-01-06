import { useStore } from '@dish/use-store'
import React, { memo } from 'react'
import { Image } from 'react-native'
import { Paragraph, Spacer, Text, VStack } from 'snackui'

import dishLogo from '../assets/dish-neon.jpg'
import { lightYellow } from '../constants/colors'
import { IntroModalStore } from './IntroModalStore'
import { LinkButton } from './views/LinkButton'
import { LoginRegisterForm } from './views/LoginRegisterForm'

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
          size="xl"
          textAlign="center"
        >
          find amazing things
        </Paragraph>

        <LinkButton
          textProps={{
            fontSize: 18,
            color: lightYellow,
            fontWeight: '700',
          }}
          alignSelf="center"
          backgroundColor={`${lightYellow}22`}
          hoverStyle={{
            backgroundColor: `${lightYellow}33`,
          }}
          name="about"
          onPressOut={() => {
            store.setHidden(true)
          }}
        >
          learn more
        </LinkButton>

        <LoginRegisterForm />
      </VStack>
    </>
  )
})
