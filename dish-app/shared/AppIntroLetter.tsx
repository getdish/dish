import { AbsoluteVStack, Paragraph, Spacer, Text, VStack } from '@dish/ui'
import { default as React, memo, useState } from 'react'
import { Image } from 'react-native'

// @ts-ignore
import dishNeon from './assets/dish-neon.jpg'
import { brandColorLighter, lightGreen, lightYellow, yellow } from './colors'
import { DarkModal } from './DarkModal'
import { useOvermind } from './state/om'
import { UserOnboard } from './UserOnboard'
import { LoginRegisterForm } from './views/LoginRegisterForm'
import { CloseButton } from './views/ui/CloseButton'
import { LinkButton } from './views/ui/LinkButton'

export const AppIntroLetter = memo(() => {
  const om = useOvermind()
  const curPage = om.state.router.curPage
  const hasOnboarded = om.state.user.user?.has_onboarded
  const isLoggedIn = om.state.user.isLoggedIn
  const [closed, setClosed] = useState(false)
  const isPublicPage = curPage.name === 'about' || curPage.name === 'blog'
  const hide = isPublicPage
    ? true
    : isLoggedIn
    ? closed
      ? true
      : hasOnboarded
    : false

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
      {isLoggedIn && !hasOnboarded && (
        <>
          <CloseButton
            position="absolute"
            zIndex={1000}
            top={10}
            right={10}
            onPress={() => {
              setClosed(true)
            }}
          />
          <UserOnboard />
        </>
      )}
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
      <VStack spacing="lg" alignItems="center">
        <Image
          source={{ uri: dishNeon }}
          style={{
            marginTop: -20,
            marginBottom: -40,
            width: 261 * 1.2,
            height: 161 * 1.2,
          }}
        />

        <Paragraph
          color="rgba(255,255,255,0.6)"
          zIndex={10}
          textAlign="center"
          fontWeight="300"
          size={1.2}
        >
          the better restaurant recommender
        </Paragraph>

        <Paragraph
          color="rgba(255,255,255,0.8)"
          fontWeight="500"
          paddingHorizontal="10%"
          sizeLineHeight={1.02}
          textAlign="center"
        >
          Let's bring the fun back to exploring the world with a community that
          breaks down hidden gems and locals tips.
          <LinkButton
            fontSize={16}
            marginLeft={5}
            marginVertical={-2}
            lineHeight={30}
            borderRadius={8}
            paddingHorizontal={8}
            color={yellow}
            backgroundColor={`${lightYellow}22`}
            hoverStyle={{
              backgroundColor: `${lightYellow}33`,
            }}
            name="about"
          >
            learn how &raquo;
          </LinkButton>
        </Paragraph>

        <Spacer size="xs" />

        {/* <Text color="rgba(255,255,255,0.4)" fontSize={16} fontWeight="600">
          early access
        </Text> */}

        <LoginRegisterForm />
      </VStack>
    </>
  )
})
