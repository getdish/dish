import {
  AbsoluteVStack,
  Box,
  Divider,
  HStack,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import { default as React, memo, useEffect } from 'react'
import { Image, ScrollView } from 'react-native'
import { useStorageState } from 'react-storage-hooks'

// @ts-ignore
import dishNeon from '../../assets/dish-neon.jpg'
import { lightBlue, lightGreen, lightOrange, lightYellow } from '../../colors'
import { Link } from '../../views/ui/Link'
import { CloseButton } from './CloseButton'
import { Input } from './Input.1'
import { Paragraph } from './Paragraph'

const useShowIntroLetter = () => {
  return useStorageState(localStorage, 'show_intro', true)
}

export const HomeIntroLetter = memo(() => {
  const [showInto, setShowIntro] = useShowIntroLetter()

  return (
    <AbsoluteVStack
      className="inset-shadow-xxxl ease-in-out-slow"
      fullscreen
      zIndex={10000000000}
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="4vw"
      paddingVertical="4vh"
      backgroundColor="rgba(0,0,0,0.6)"
      opacity={1}
      transform={[{ translateY: 0 }]}
      {...(!showInto && {
        opacity: 0,
        transform: [{ translateY: 15 }],
        pointerEvents: 'none',
      })}
    >
      <VStack
        maxWidth={450}
        maxHeight={600}
        height="100%"
        width="100%"
        position="relative"
        backgroundColor="#000"
        borderRadius={15}
        shadowColor="rgba(0,0,0,0.6)"
        shadowRadius={50}
        shadowOffset={{ height: 10, width: 0 }}
      >
        <ScrollView style={{ width: '100%' }}>
          <VStack padding={20} alignItems="center">
            <HStack position="absolute" top={10} right={10}>
              <CloseButton onPress={() => setShowIntro(false)} />
            </HStack>

            <Spacer />

            <HomeIntroLetterContent />
          </VStack>
        </ScrollView>
      </VStack>
    </AbsoluteVStack>
  )
})

export const HomeIntroLetterContent = () => {
  const [showInto, setShowIntro] = useShowIntroLetter()
  return (
    <VStack spacing alignItems="center">
      <Image
        source={{ uri: dishNeon }}
        style={{ width: 229 * 0.8, height: 134 * 0.8 }}
      />

      <Paragraph textAlign="center" color="#fff" fontWeight="300" size={1.4}>
        a new take on food discovery
        <br />
        <Text color={lightGreen} fontWeight="500">
          the best food down to the dish
        </Text>
        <br />
        <Text color={lightYellow} fontWeight="500">
          search every delivery service at once
        </Text>
        <br />
        find hole 🕳 in the wall gems 💎
      </Paragraph>

      <Spacer size="xl" />
      <VStack width="80%" minHeight={1} backgroundColor="#fff" opacity={0.1} />
      <Spacer size="xl" />

      <VStack alignItems="center" spacing="lg">
        <VStack
          borderRadius={9}
          borderColor="rgba(255,255,255,0.15)"
          borderWidth={2}
          hoverStyle={{
            borderColor: 'rgba(255,255,255,0.3)',
          }}
        >
          <div
            id="appleid-signin"
            className="signin-button"
            data-color="black"
            data-border="true"
            data-type="sign in"
          ></div>
        </VStack>

        <HStack>
          <SmallTitle divider="center">or</SmallTitle>
        </HStack>

        <form>
          <VStack spacing>
            <Input style={{ color: '#fff' }} placeholder="Username" />
            <Input
              style={{ color: '#fff' }}
              secureTextEntry
              placeholder="Password"
            />
          </VStack>
        </form>
      </VStack>

      <Spacer size="xl" />
      <VStack width="80%" minHeight={1} backgroundColor="#fff" opacity={0.1} />
      <Spacer size="xl" />

      <Text
        onPress={() => {
          setShowIntro(false)
        }}
        color="rgba(255,255,255,0.5)"
        fontWeight="300"
        fontSize={14}
      >
        we're trying to build a new type of community.{' '}
        <Link name="about">learn more.</Link>
      </Text>
    </VStack>
  )
}
