import { Store, useStore } from '@dish/use-store'
import {
  default as React,
  memo,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { Image } from 'react-native'
import { AbsoluteVStack, Paragraph, Spacer, Text, VStack } from 'snackui'

// @ts-ignore
import dishNeon from './assets/dish-neon.jpg'
import { brandColorLighter, lightGreen, lightYellow, yellow } from './colors'
import { DarkModal } from './DarkModal'
import { useOvermind } from './state/om'
import { UserOnboard } from './UserOnboard'
import { LoginRegisterForm } from './views/LoginRegisterForm'
import { CloseButton } from './views/ui/CloseButton'
import { LinkButton } from './views/ui/LinkButton'

class IntroModal extends Store {
  hidden = true
  started = false

  setHidden(val: boolean) {
    this.started = true
    this.hidden = val
  }
}

export const AppIntroLetter = memo(() => {
  const om = useOvermind()
  const hasOnboarded = om.state.user.user?.has_onboarded
  const isLoggedIn = om.state.user.isLoggedIn
  const store = useStore(IntroModal)
  // const curPage = om.state.router.curPage
  // const isPublicPage = curPage.name === 'about' || curPage.name === 'blog'
  // make it private only
  // isPublicPage
  //   ? true
  //   : isLoggedIn
  //   ? closed
  //     ? true
  //     : hasOnboarded
  //   : false

  useLayoutEffect(() => {
    if (store.started) return
    if (!isLoggedIn || (isLoggedIn && !hasOnboarded)) {
      store.setHidden(false)
    }
  }, [store.hidden, isLoggedIn, hasOnboarded])

  if (isLoggedIn && hasOnboarded) {
    return null
  }

  return (
    <DarkModal
      hide={store.hidden}
      outside={
        <>
          <CloseButton
            position="absolute"
            zIndex={1000}
            top={15}
            right={15}
            opacity={0.9}
            backgroundColor="transparent"
            onPress={() => {
              store.setHidden(true)
            }}
          />
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
      {!isLoggedIn && (
        <>
          <AppIntroLogin />
        </>
      )}
      {isLoggedIn && !hasOnboarded && (
        <>
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
  const store = useStore(IntroModal)
  return (
    <>
      <VStack spacing="lg" alignItems="center" width="100%">
        <Image
          source={{ uri: dishNeon }}
          style={{
            marginTop: -20,
            marginBottom: -40,
            width: 261 * 1,
            height: 161 * 1,
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
          paddingHorizontal="2%"
          sizeLineHeight={1.02}
          textAlign="center"
        >
          Bring fun to exploring the world.
          <br />
          A&nbsp;community finding
          <LinkButton
            display="inline"
            fontSize={16}
            marginLeft={5}
            lineHeight={26}
            paddingVertical={2}
            borderRadius={8}
            paddingHorizontal={8}
            color={yellow}
            backgroundColor={`${lightYellow}22`}
            fontWeight="400"
            hoverStyle={{
              backgroundColor: `${lightYellow}33`,
            }}
            name="about"
            onPressOut={() => {
              store.setHidden(true)
            }}
          >
            hidden gems 💎
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
