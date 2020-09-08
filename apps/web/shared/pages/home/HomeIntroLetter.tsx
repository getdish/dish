import { AbsoluteVStack, HStack, Spacer, Text, VStack } from '@dish/ui'
import { default as React, memo } from 'react'
import { Image, ScrollView } from 'react-native'
import { useStorageState } from 'react-storage-hooks'

// @ts-ignore
import dishNeon from '../../assets/dish-neon.jpg'
import { lightGreen, lightYellow } from '../../colors'
import { Link } from '../../views/ui/Link'
import { CloseButton } from './CloseButton'
import { LoginRegisterForm } from './LoginRegisterForm'
import { Paragraph } from './Paragraph'

const useShowIntroLetter = () => {
  return useStorageState(localStorage, 'show_intro22', true)
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
        maxHeight={680}
        height="100%"
        width="100%"
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

export const HomeIntroLetterContent = memo(() => {
  const [showInto, setShowIntro] = useShowIntroLetter()
  const divider = (
    <VStack
      marginVertical={8}
      width="80%"
      minHeight={1}
      backgroundColor="#fff"
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

      <Paragraph textAlign="center" color="#fff" fontWeight="300" size={1.3}>
        <Text opacity={0.8}>a new take on food discovery</Text>
        <br />
        <Text color={lightGreen} fontWeight="400">
          the best, down to the dish
        </Text>
        <br />
        <Text color={lightYellow} fontWeight="500">
          search every delivery service
        </Text>
        <br />
        <Text fontWeight="700">find hole 🕳 in the wall gems 💎</Text>
      </Paragraph>

      {divider}

      <LoginRegisterForm />

      {divider}

      <Text
        marginVertical={15}
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
})
