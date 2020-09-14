import { AbsoluteVStack, HStack, Spacer, Text, VStack } from '@dish/ui'
import { default as React, memo } from 'react'
import { Image, Platform, ScrollView, View } from 'react-native'
import { useStorageState } from 'react-storage-hooks'

// @ts-ignore
import dishNeon from '../../assets/dish-neon.jpg'
import { lightGreen, lightYellow } from '../../colors'
import { useOvermind } from '../../state/om'
import { Link } from '../../views/ui/Link'
import { CloseButton } from './CloseButton'
import { LoginRegisterForm } from './LoginRegisterForm'
import { Paragraph } from './Paragraph'

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
    return (
      <VStack spacing alignItems="center">
        <Image
          source={{ uri: dishNeon }}
          style={{
            width: 229 * 0.75,
            height: 134 * 0.75,
          }}
        />

        <Paragraph textAlign="center" color="#fff" fontWeight="300" size={1.2}>
          <Text opacity={0.8}>a food discovery community</Text>
        </Paragraph>

        {divider}

        <Paragraph textAlign="center" color="#fff" fontWeight="300" size={1.1}>
          <Text color={lightGreen} fontWeight="400">
            ratings by dish
          </Text>
          <View />
          <Text color={lightYellow} fontWeight="500">
            search all delivery services
          </Text>
          <View />
          <Text fontWeight="700">find local gems 💎</Text>
        </Paragraph>

        {divider}

        <Paragraph
          textAlign="center"
          color="rgba(255,255,255,0.5)"
          fontWeight="700"
          size="sm"
        >
          Early access
        </Paragraph>

        <LoginRegisterForm />
      </VStack>
    )
  }
)
