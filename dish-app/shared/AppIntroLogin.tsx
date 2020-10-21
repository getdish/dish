import { useStore } from '@dish/use-store'
import React, { memo } from 'react'
import { Image } from 'react-native'
import { Paragraph, Spacer, Text, VStack } from 'snackui'

import dishNeon from './assets/dish-neon.jpg'
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
        spacing="xl"
        alignItems="center"
        width="100%"
      >
        <Image
          source={{ uri: dishNeon }}
          style={{
            marginTop: -70,
            marginBottom: -110,
            marginRight: -20,
            width: 261 * 3,
            height: 161 * 3,
            transform: [{ rotate: '10deg' }],
            zIndex: -2,
            position: 'relative',
          }}
        />

        <Paragraph
          color="#fff"
          zIndex={10}
          textAlign="center"
          fontWeight="300"
          size={2}
        >
          <Text opacity={0.5}>the</Text>
          <Text>fun</Text>
          <Text opacity={0.5}>food</Text>
          <Text>pokédex</Text>
        </Paragraph>

        <Paragraph
          color="#E2A5D9"
          paddingHorizontal="3%"
          maxWidth={320}
          fontWeight="500"
          size="xl"
          textAlign="center"
        >
          better rankings
          <br />
          ratings down to the dish
          <br />
          search every delivery spot at once
        </Paragraph>

        <LinkButton
          display="inline"
          fontSize={18}
          paddingVertical={4}
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

        <Spacer size="xs" />

        <LoginRegisterForm />
      </VStack>
    </>
  )
})
