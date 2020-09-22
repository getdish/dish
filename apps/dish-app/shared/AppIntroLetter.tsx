import { AbsoluteVStack, Text, VStack } from '@dish/ui'
import { default as React, memo } from 'react'
import { Image, Platform, ScrollView, View } from 'react-native'
import { useStorageState } from 'react-storage-hooks'

// @ts-ignore
import dishNeon from './assets/dish-neon.jpg'
import { brandColor, lightGreen, lightYellow } from './colors'
import { useOvermind } from './state/om'
import { LoginRegisterForm } from './views/LoginRegisterForm'
import { Paragraph } from './views/ui/Paragraph'

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
        maxHeight={700}
        height="98%"
        width="90%"
        borderWidth={2}
        borderColor={brandColor}
        position="relative"
        backgroundColor="#000"
        borderRadius={15}
        shadowColor="rgba(0,0,0,0.6)"
        shadowRadius={50}
        shadowOffset={{ height: 10, width: 0 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
        >
          <VStack padding={20} alignItems="center">
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
          <Text color={lightGreen} fontWeight="500">
            ratings by dish 🌮
          </Text>
          <View />
          <Text color={lightYellow}>search every delivery app 🚗 </Text>
          <View />
          <Text fontWeight="500">local gems 💎</Text>
        </Paragraph>

        {divider}

        <LoginRegisterForm />
      </VStack>
    )
  }
)
