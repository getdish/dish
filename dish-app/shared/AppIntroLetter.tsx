import { useRouter } from '@dish/router'
import {
  AbsoluteVStack,
  AnimatedVStack,
  Paragraph,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import { default as React, memo } from 'react'
import { Image, Platform, ScrollView, View } from 'react-native'
import { useStorageState } from 'react-storage-hooks'

// @ts-ignore
import dishNeon from './assets/dish-neon.jpg'
import {
  brandColor,
  brandColorLight,
  brandColorLighter,
  lightGreen,
  lightYellow,
} from './colors'
import { useOvermind } from './state/om'
import { LoginRegisterForm } from './views/LoginRegisterForm'
import { Link } from './views/ui/Link'
import { LinkButton } from './views/ui/LinkButton'

export const HomeIntroLetter = memo(() => {
  const om = useOvermind()
  const curPage = om.state.router.curPage
  const hide = om.state.user.isLoggedIn || curPage.name === 'about'

  return (
    <AbsoluteVStack
      className="inset-shadow-xxxl ease-in-out-slow"
      fullscreen
      zIndex={10000000000}
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="4vw"
      paddingVertical="1vh"
      backgroundColor="rgba(50,20,40,0.8)"
      opacity={hide ? 0 : 1}
      pointerEvents={hide ? 'none' : 'auto'}
      transform={[{ translateY: 0 }]}
    >
      <AnimatedVStack
        maxWidth={450}
        maxHeight={680}
        width="90%"
        height="90%"
        animateState={hide ? 'out' : 'in'}
      >
        <VStack
          width="100%"
          height="100%"
          borderWidth={1}
          borderColor={`${brandColor}55`}
          position="relative"
          backgroundColor="#000"
          borderRadius={25}
          shadowColor="rgba(0,0,0,1)"
          shadowRadius={150}
          shadowOffset={{ height: 10, width: 0 }}
        >
          <AbsoluteVStack
            bottom={-40}
            right={-20}
            transform={[{ rotate: '-10deg' }]}
          >
            <Text fontSize={80}>🌮</Text>
          </AbsoluteVStack>
          <AbsoluteVStack
            bottom={-40}
            left={-20}
            transform={[{ rotate: '10deg' }]}
          >
            <Text fontSize={80}>🍜</Text>
          </AbsoluteVStack>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              maxWidth: '100%',
              maxHeight: 630,
            }}
          >
            <VStack flex={1} paddingTop={20} alignItems="center">
              {/* <HStack position="absolute" top={10} right={10}>
              <CloseButton onPress={() => setShowIntro(false)} />
            </HStack> */}
              {/* <Spacer /> */}

              <HomeIntroLetterContent />
            </VStack>
          </ScrollView>
        </VStack>
      </AnimatedVStack>
    </AbsoluteVStack>
  )
})

const divider = (
  <VStack
    marginVertical={8}
    width="80%"
    minHeight={1}
    backgroundColor="#fff"
    alignSelf="center"
    opacity={0.1}
  />
)

export const HomeIntroLetterContent = memo(() => {
  return (
    <>
      <VStack spacing alignItems="center">
        <Image
          source={{ uri: dishNeon }}
          style={{
            marginTop: -20,
            marginBottom: -30,
            width: 261,
            height: 161,
          }}
        />

        <Paragraph
          zIndex={10}
          textAlign="center"
          color="#fff"
          fontWeight="300"
          size={1.2}
        >
          <Text fontSize={24} fontWeight="300" color="#fff">
            your personal guide to food
          </Text>
        </Paragraph>

        {divider}

        <>
          <VStack>
            <Text color={lightGreen} fontWeight="500">
              <LinkButton
                fontSize={16}
                lineHeight={28}
                borderRadius={8}
                paddingHorizontal={8}
                marginHorizontal={-8}
                color={brandColorLighter}
                backgroundColor={`${lightYellow}33`}
                hoverStyle={{
                  backgroundColor: `${lightYellow}44`,
                }}
                name="about"
              >
                the best spots ✨ & dishes 🍽
              </LinkButton>
            </Text>
          </VStack>
          <Spacer size="xs" />
          <VStack>
            <Text fontSize={16} lineHeight={28} color={lightYellow}>
              search every delivery app 🚗{' '}
            </Text>
          </VStack>
          {/* <Text fontWeight="500">local gems 💎</Text> */}
        </>

        <Spacer size="xs" />

        <LoginRegisterForm />
      </VStack>
    </>
  )
})
