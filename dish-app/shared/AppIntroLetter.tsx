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
            width: 261 * 1.2,
            height: 161 * 1.2,
          }}
        />

        <Paragraph
          zIndex={10}
          textAlign="center"
          color="#fff"
          fontWeight="300"
          size={1.2}
        >
          <Text fontSize={20} fontWeight="500" color="#fff">
            the better restaurant recommender
          </Text>
        </Paragraph>

        <>
          <VStack>
            <LinkButton
              fontSize={16}
              lineHeight={30}
              borderRadius={8}
              fontWeight="300"
              paddingHorizontal={8}
              marginHorizontal={-8}
              color="#fff"
              backgroundColor={`${lightYellow}22`}
              hoverStyle={{
                backgroundColor: `${lightYellow}33`,
              }}
              name="about"
            >
              learn how dish fixes food search
            </LinkButton>
          </VStack>
        </>

        <Spacer size="xs" />

        <Text color="rgba(255,255,255,0.4)" fontSize={16} fontWeight="600">
          early access
        </Text>

        <LoginRegisterForm />
      </VStack>
    </>
  )
})
