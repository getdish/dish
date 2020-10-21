import { Store, useStore } from '@dish/use-store'
import {
  default as React,
  memo,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import { Image, StyleSheet } from 'react-native'
import { Line } from 'react-native-svg'
import {
  AbsoluteVStack,
  LinearGradient,
  Paragraph,
  Spacer,
  Text,
  VStack,
} from 'snackui'

// @ts-ignore
import dishNeon from './assets/dish-neon.jpg'
import {
  brandColorLighter,
  lightGreen,
  lightPurple,
  lightYellow,
  purple,
  yellow,
} from './colors'
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
            opacity={0.5}
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
            <Text fontSize={70}>🌮</Text>
          </AbsoluteVStack>
          <AbsoluteVStack
            bottom={-20}
            left={-20}
            transform={[{ rotate: '10deg' }]}
          >
            <Text fontSize={70}>🍜</Text>
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
      <VStack
        overflow="hidden"
        borderRadius={20}
        spacing="xl"
        alignItems="center"
        width="100%"
      >
        <Image
          source={{ uri: dishNeon }}
          style={{
            marginTop: -70,
            marginBottom: -110,
            marginRight: -20,
            width: 261 * 3,
            height: 161 * 3,
            transform: [{ rotate: '10deg' }],
            zIndex: -2,
            position: 'relative',
          }}
        />
        {/* <LinearGradient
          style={[
            StyleSheet.absoluteFill,
            {
              zIndex: -1,
            },
          ]}
          colors={['rgba(0,0,0,0)', '#E2A5D922']}
        /> */}

        <Paragraph
          color="#fff"
          zIndex={10}
          textAlign="center"
          fontWeight="300"
          size={2}
        >
          <Text opacity={0.5}>the</Text>
          <Text>fun</Text>
          <Text opacity={0.5}>food</Text>
          <Text>pokédex</Text>
        </Paragraph>

        <Paragraph
          color="#E2A5D9"
          paddingHorizontal="3%"
          maxWidth={320}
          fontWeight="500"
          size="xl"
          textAlign="center"
        >
          better rankings
          <br />
          ratings down to the dish
          <br />
          search every delivery spot at once
        </Paragraph>

        <LinkButton
          display="inline"
          fontSize={18}
          paddingVertical={4}
          borderRadius={8}
          paddingHorizontal={6}
          color={lightYellow}
          backgroundColor={`${lightYellow}22`}
          fontWeight="700"
          hoverStyle={{
            backgroundColor: `${lightYellow}33`,
          }}
          name="about"
          onPressOut={() => {
            store.setHidden(true)
          }}
        >
          learn more
        </LinkButton>

        <Spacer size="xs" />

        <LoginRegisterForm />
      </VStack>
    </>
  )
})
