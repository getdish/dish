import { AUTH_IMAGE_UPLOAD_ENDPOINT } from '@dish/graph'
import {
  AbsoluteVStack,
  AnimatedVStack,
  HStack,
  Input,
  Paragraph,
  Spacer,
  Text,
  TextArea,
  Toast,
  VStack,
} from '@dish/ui'
import { default as React, memo, useRef, useState } from 'react'
import { Image, ScrollView } from 'react-native'

// @ts-ignore
import dishNeon from './assets/dish-neon.jpg'
import {
  brandColor,
  brandColorLighter,
  lightGreen,
  lightYellow,
} from './colors'
import { useOvermind } from './state/om'
import { omStatic } from './state/omStatic'
import { LoginRegisterForm } from './views/LoginRegisterForm'
import { LinkButton } from './views/ui/LinkButton'
import { SmallButton } from './views/ui/SmallButton'

export const AppIntroLetter = memo(() => {
  const om = useOvermind()
  const curPage = om.state.router.curPage
  const hasOnboarded = om.state.user.user?.has_onboarded
  const isLoggedIn = om.state.user.isLoggedIn
  const hide =
    (isLoggedIn && hasOnboarded) ||
    curPage.name === 'about' ||
    curPage.name === 'blog'

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
        width="99%"
        height="99%"
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
              {!isLoggedIn && <AppIntroLogin />}
              {isLoggedIn && !hasOnboarded && <AppIntroOnboard />}
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

const characters = [
  '👻',
  '🧑‍🍳',
  '👩‍🍳',
  '👽',
  '🧙',
  '🧑‍🚀',
  '🧜',
  '🧚',
  '👸',
  '🤴',
  '👾',
  '🤠',
  '😺',
  '😈',
  '👦',
  '🤓',
  '🦸',
  '💃',
  '🕺',
  '🐱',
  '🐷',
  '🐻',
  '🐼',
  '🐭',
  '🐶',
  '🐨',
  '🐙',
  '🦊',
]

const AppIntroOnboard = () => {
  const imageFormRef = useRef(null)
  const formState = useRef({
    about: '',
    location: '',
  })
  const [charIndex, setChar] = useState(0)
  const char = characters[charIndex]

  return (
    <>
      <VStack
        spacing
        alignItems="center"
        paddingBottom={60}
        paddingHorizontal={20}
      >
        <Image
          source={{ uri: dishNeon }}
          style={{
            marginTop: -20,
            width: 261,
            height: 161,
          }}
        />

        <Paragraph color="#fff">
          Welcome to the beta! Lets get you onboarded.
        </Paragraph>

        {divider}

        <HStack>
          <VStack position="relative">
            <Image
              source={{ uri: require('./assets/user-default.jpg').default }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
              }}
            />
            <Text position="absolute" bottom={-15} left={-15} fontSize={50}>
              {char}
            </Text>
          </VStack>
          <form
            id="userform"
            ref={imageFormRef}
            style={{
              maxWidth: 100,
            }}
          >
            <label htmlFor="file">Upload a file</label>
            <input
              type="file"
              name="upload"
              style={{
                fontSize: 30,
                padding: 10,
              }}
              onChange={async () => {
                const form = imageFormRef.current
                const formData = new FormData(form)
                await fetch(AUTH_IMAGE_UPLOAD_ENDPOINT, {
                  method: 'POST',
                  body: formData,
                })
                Toast.show('Saved image!')
              }}
            />
          </form>
        </HStack>

        {divider}

        <Text color="#fff" fontWeight="600">
          Character
        </Text>
        <HStack alignItems="center" justifyContent="center" flexWrap="wrap">
          {characters.map((icon, i) => {
            return (
              <HStack
                cursor="pointer"
                borderRadius={100}
                padding={10}
                backgroundColor={i === charIndex ? '#fff' : 'transparent'}
                hoverStyle={{
                  backgroundColor: i === charIndex ? '#fff' : '#444',
                }}
                onPress={() => {
                  setChar(i)
                }}
              >
                <Text fontSize={30} key={i}>
                  {icon}
                </Text>
              </HStack>
            )
          })}
        </HStack>

        {divider}

        <Text color="#fff" fontWeight="600">
          About you
        </Text>
        <TextArea
          placeholder="Optional description for your profile..."
          fontSize={16}
          width="100%"
          onChangeText={(text) => {
            formState.current.about = text
          }}
        />
        <Input
          placeholder="Location..."
          fontSize={16}
          width="100%"
          onChangeText={(text) => {
            formState.current.location = text
          }}
        />

        {divider}

        <Spacer />

        <SmallButton
          accessibilityComponentType="button"
          accessible
          accessibilityRole="button"
          alignSelf="center"
          backgroundColor="#222"
          borderColor="#444"
          textStyle={{
            color: '#fff',
          }}
          onPress={async () => {
            Toast.show('Saving...')
            if (
              await omStatic.actions.user.finishOnboard({
                character: characters[charIndex],
                about: formState.current.about,
                location: formState.current.location,
              })
            ) {
              Toast.show(`All set! Welcome!`)
            }
          }}
        >
          Done!
        </SmallButton>
      </VStack>
    </>
  )
}

export const AppIntroLogin = memo(() => {
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
