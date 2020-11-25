import { useStore } from '@dish/use-store'
import React, { memo } from 'react'
import { Image } from 'react-native'
import { Paragraph, Spacer, Text, VStack } from 'snackui'

import dishLogo from './assets/dish-neon.jpg'
import { lightYellow } from './colors'
import { IntroModal } from './IntroModal'
import { LoginRegisterForm } from './views/LoginRegisterForm'
import { LinkButton } from './views/ui/LinkButton'

export const AppIntroLogin = memo(() => {
  const store = useStore(IntroModal)
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
          find great restaurants
          <br />
          w/ ratings down to the dish
          <br />
          across every delivery app
        </Paragraph>

        <LinkButton
          display="inline"
          fontSize={18}
          paddingVertical={6}
          borderRadius={8}
          paddingHorizontal={6}
          color={lightYellow}
          backgroundColor={`${lightYellow}22`}
          fontWeight="700"
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
