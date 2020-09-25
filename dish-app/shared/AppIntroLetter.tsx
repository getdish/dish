import { AbsoluteVStack, Paragraph, Text, VStack } from '@dish/ui'
import { default as React, memo } from 'react'
import { Image, Platform, ScrollView, View } from 'react-native'
import { useStorageState } from 'react-storage-hooks'

// @ts-ignore
import dishNeon from './assets/dish-neon.jpg'
import { brandColor, lightGreen, lightYellow } from './colors'
import { useOvermind } from './state/om'
import { LoginRegisterForm } from './views/LoginRegisterForm'

const useShowIntroLetter = () => {
  return useStorageState(localStorage, 'show_intro22', true)
}

export const HomeIntroLetter = memo(() => {
  const [showInto, setShowIntro] = useShowIntroLetter()
  const om = useOvermind()

  if (om.state.user.isLoggedIn) {
    return null
  }

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
        maxHeight={680}
        width="90%"
        height="90%"
        borderWidth={1}
        borderColor={`${brandColor}55`}
        position="relative"
        backgroundColor="#000"
        borderRadius={25}
        shadowColor="rgba(0,0,0,1)"
        shadowRadius={150}
        shadowOffset={{ height: 10, width: 0 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            maxWidth: '100%',
          }}
        >
          <VStack
            overflow="hidden"
            maxWidth={450}
            maxHeight={660}
            padding={20}
            alignItems="center"
          >
            {/* <HStack position="absolute" top={10} right={10}>
              <CloseButton onPress={() => setShowIntro(false)} />
            </HStack> */}
            {/* <Spacer /> */}

            <HomeIntroLetterContent />
          </VStack>
        </ScrollView>
      </VStack>
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

export const HomeIntroLetterContent = memo(
  ({ forceVisible }: { forceVisible?: boolean }) => {
    const [showIntro_, setShowIntro] = useShowIntroLetter()
    const showIntro = forceVisible ?? showIntro_

    if (Platform.OS !== 'web') {
      return null
    }

    if (!showIntro) {
      return null
    }

    return (
      <>
        <AbsoluteVStack
          bottom={-40}
          right={-10}
          transform={[{ rotate: '-10deg' }]}
        >
          <Text fontSize={100}>🌮</Text>
        </AbsoluteVStack>
        <AbsoluteVStack
          bottom={-40}
          left={-10}
          transform={[{ rotate: '10deg' }]}
        >
          <Text fontSize={100}>🍜</Text>
        </AbsoluteVStack>
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
              a fun food discovery community
            </Text>
          </Paragraph>

          {divider}

          <Paragraph textAlign="center" color="#fff" size={1.1}>
            <VStack>
              <Text color={lightGreen} fontWeight="500">
                ratings by dish 🌮
              </Text>
            </VStack>
            <VStack>
              <Text color={lightYellow}>search every delivery app 🚗 </Text>
            </VStack>
            {/* <Text fontWeight="500">local gems 💎</Text> */}
          </Paragraph>

          {divider}

          <LoginRegisterForm />
        </VStack>
      </>
    )
  }
)
