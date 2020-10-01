import { AbsoluteVStack, Paragraph, Spacer, Text, VStack } from '@dish/ui'
import { default as React, memo } from 'react'
import { Image } from 'react-native'

// @ts-ignore
import dishNeon from './assets/dish-neon.jpg'
import { brandColorLighter, lightGreen, lightYellow } from './colors'
import { DarkModal } from './DarkModal'
import { useOvermind } from './state/om'
import { UserOnboard } from './UserOnboard'
import { LoginRegisterForm } from './views/LoginRegisterForm'
import { LinkButton } from './views/ui/LinkButton'

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
    <DarkModal
      hide={hide}
      outside={
        <>
          <AbsoluteVStack
            bottom={-20}
            right={-20}
            transform={[{ rotate: '-10deg' }]}
          >
            <Text fontSize={60}>🌮</Text>
          </AbsoluteVStack>
          <AbsoluteVStack
            bottom={-20}
            left={-20}
            transform={[{ rotate: '10deg' }]}
          >
            <Text fontSize={60}>🍜</Text>
          </AbsoluteVStack>
        </>
      }
    >
      {!isLoggedIn && <AppIntroLogin />}
      {isLoggedIn && !hasOnboarded && <UserOnboard />}
    </DarkModal>
  )
})

export const divider = (
  <VStack
    marginVertical={8}
    width="80%"
    minHeight={1}
    backgroundColor="#fff"
    alignSelf="center"
    opacity={0.1}
  />
)

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
