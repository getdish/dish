import { Home } from '@dish/react-feather'
import { useStore } from '@dish/use-store'
import React, { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Globe, { GlobeMethods } from 'react-globe.gl'
import { StyleSheet } from 'react-native'
import {
  AbsoluteVStack,
  Button,
  Grid,
  HStack,
  Input,
  LinearGradient,
  Modal,
  Paragraph,
  Spacer,
  Text,
  Theme,
  Title,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import earthDark from '../assets/earth-dark.jpg'
import iphoneScreen from '../assets/iphone-home-screen.jpg'
import { blue, blue300, green, pink, yellow } from '../constants/colors'
import { useQueryLoud } from '../helpers/useQueryLoud'
import { useRouterCurPage } from '../router'
import { AppIntroLogin } from './AppIntroLogin'
import { AuthForm } from './AuthForm'
import { useFormAction } from './hooks/useFormAction'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { IntroModalStore } from './IntroModalStore'
import { UserOnboard } from './UserOnboard'
import { useUserStore } from './userStore'
import { CloseButton, SmallCircleButton } from './views/CloseButton'
import { DarkModal } from './views/DarkModal'
import { SubmittableForm, ValidatedInput } from './views/Form'
import { Image } from './views/Image'
import { LogoColor } from './views/Logo'
import { PaneControlButtons } from './views/PaneControlButtons'
import { SlantedTitle } from './views/SlantedTitle'

export const AppIntroLetter = memo(() => {
  const [showSignup, setShowSignup] = useState(false)
  const userStore = useUserStore()
  const [closes, setCloses] = useLocalStorageState('modal-intro-closes', 0)
  const hasOnboarded = userStore.user?.has_onboarded
  const isLoggedIn = userStore.isLoggedIn
  const store = useStore(IntroModalStore)
  const curPage = useRouterCurPage()
  const isPasswordReset = curPage.name == 'passwordReset'
  const media = useMedia()
  const globeRef = useRef<GlobeMethods>()
  const theme = useTheme()

  const countries = useQueryLoud(
    'countries',
    () => fetch('/api/countries').then((res) => res.json()),
    {
      suspense: false,
    }
  )
  const features = countries.data?.features ?? []

  console.log('countries', countries)

  useLayoutEffect(() => {
    if (store.started) return
    if (closes >= 3) {
      store.setHidden(true)
      return
    }
    if (!isLoggedIn || (isLoggedIn && !hasOnboarded)) {
      store.setHidden(false)
    }
  }, [closes, store.hidden, isLoggedIn, hasOnboarded])

  useEffect(() => {
    if (!globeRef.current) return
    const globe = globeRef.current
    console.log('globe', globe)
    const controls = globe.controls() as any
    console.log('controls', controls)
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.25
  }, [])

  if (isLoggedIn && hasOnboarded) {
    return null
  }

  if (isLoggedIn && !hasOnboarded) {
    return (
      <DarkModal
        fullscreen
        hide={store.hidden}
        onDismiss={store.setHidden}
        outside={
          <>
            <SmallCircleButton
              icon={<Home size={24} color="rgba(255,255,255,0.5)" />}
              zIndex={1000}
              top={15}
              right={15}
              size={48}
              hoverStyle={{
                backgroundColor: 'rgba(255,255,255,0.3)',
              }}
              onPress={() => {
                setCloses(closes + 1)
                store.setHidden(true)
              }}
            />
          </>
        }
      >
        <UserOnboard />
      </DarkModal>
    )
  }

  return (
    <>
      <Theme name="dark">
        <Modal
          visible={showSignup}
          onDismiss={() => setShowSignup(false)}
          flex={1}
          paddingHorizontal={20}
          paddingVertical={30}
        >
          <PaneControlButtons>
            <CloseButton onPress={() => setShowSignup(false)} />
          </PaneControlButtons>

          <SlantedTitle alignSelf="center">Welcome!</SlantedTitle>

          <Spacer />

          <SignupBetaForm />
        </Modal>
      </Theme>

      <DarkModal fullscreen hide={store.hidden} onDismiss={store.setHidden}>
        {!isLoggedIn && !isPasswordReset && (
          <VStack
            paddingVertical={media.sm ? 20 : 50}
            paddingHorizontal={20}
            maxWidth={850}
            alignItems="center"
            minHeight="100%"
            spacing="xl"
          >
            <LogoColor scale={media.sm ? 1.5 : 1.8} />

            <Text
              color={theme.color}
              textAlign="center"
              fontSize={media.sm ? 40 : 60}
              fontWeight="900"
              selectable
            >
              Curate a better map of the&nbsp;world, together.
            </Text>

            <AbsoluteVStack top={90} pointerEvents="none" zIndex={-1}>
              <Globe
                ref={globeRef}
                globeImageUrl={earthDark}
                arcDashAnimateTime={5000}
                arcsTransitionDuration={5000}
                enablePointerInteraction={false}
                showGraticules
                showAtmosphere
                animateIn
                hexPolygonsData={features}
                hexPolygonResolution={4}
                hexPolygonMargin={0.3}
                // rendererConfig={{
                //   antialias: false,
                // }}
                hexPolygonColor={() =>
                  `#${Math.round(Math.random() * Math.pow(2, 24))
                    .toString(16)
                    .padStart(6, '0')}`
                }
                hexPolygonLabel={({ properties: d }) => `
        <b>${d.ADMIN} (${d.ISO_A2})</b> <br />
        Population: <i>${d.POP_EST}</i>
      `}
              />
              <LinearGradient
                style={StyleSheet.absoluteFill}
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
              />
            </AbsoluteVStack>

            <Button
              theme="active"
              paddingVertical={12}
              paddingHorizontal={20}
              elevation={3}
              borderRadius={100}
              textProps={{ fontSize: 16, fontWeight: '800' }}
              onPress={() => setShowSignup(true)}
            >
              Sign up &nbsp; ✨
            </Button>

            <Spacer />
            <Spacer />

            <Text
              color={theme.color}
              textAlign="center"
              fontSize={media.sm ? 24 : 32}
              marginHorizontal="7%"
              fontWeight="700"
              selectable
            >
              Adventure, or just better pho.
            </Text>

            <Text
              color={theme.color}
              textAlign="center"
              fontSize={media.sm ? 22 : 28}
              marginHorizontal="7%"
              lineHeight={media.sm ? 30 : 40}
              fontWeight="200"
              selectable
              opacity={0.8}
            >
              Dish is a community for curation - for travelers, foodies, or people who just like
              finding great things.
            </Text>

            <Spacer size="xl" />

            <HStack flexWrap="wrap">
              <GridItem
                title="Discover"
                content="Better reviews of every restaurant - search across delivery, by dish and more."
                color={blue}
                image={iphoneScreen}
              />

              <GridItem
                title="Curate"
                content="Collect your favorite nights out, plan a trip, and share your tips with friends."
                color={green}
                image={iphoneScreen}
                position="right"
              />

              <GridItem
                isLast
                title="Earn"
                color={pink}
                content="Curators and contributors earn for lists, photos and reviews."
                image={iphoneScreen}
                position="below"
              />
            </HStack>
          </VStack>
        )}
      </DarkModal>
    </>
  )
})

// <>
//           <SmallCircleButton
//             position="absolute"
//             icon={<Home size={24} color="rgba(255,255,255,0.5)" />}
//             zIndex={1000}
//             top={15}
//             right={15}
//             size={48}
//             hoverStyle={{
//               backgroundColor: 'rgba(255,255,255,0.3)',
//             }}
//             onPress={() => {
//               setCloses(closes + 1)
//               store.setHidden(true)
//             }}
//           />
//           <AbsoluteVStack
//             pointerEvents="none"
//             bottom={-10}
//             zIndex={1000}
//             right={-40}
//             rotate="-10deg"
//           >
//             <Text fontSize={62}>🌮</Text>
//           </AbsoluteVStack>
//           <AbsoluteVStack pointerEvents="none" bottom={-10} zIndex={1000} left={-40} rotate="10deg">
//             <Text fontSize={62}>🍜</Text>
//           </AbsoluteVStack>
//         </>

const GridItem = (props: {
  title: string
  content: string
  image: string
  isLast?: boolean
  color: string
  position?: 'right' | 'below'
}) => {
  const media = useMedia()
  const theme = useTheme()

  return (
    <VStack
      minWidth={260}
      minHeight={250}
      borderRadius={30}
      padding={26}
      overflow="hidden"
      marginBottom={20}
      marginHorizontal={10}
      position="relative"
      flex={1}
      {...(props.position === 'below' && {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 150,
      })}
    >
      <AbsoluteVStack fullscreen backgroundColor={props.color} zIndex={0} opacity={0.2} />

      <Text
        color={theme.color}
        textAlign="center"
        fontSize={media.sm ? 20 : 35}
        fontWeight="800"
        selectable
      >
        {props.title}
      </Text>

      <Spacer size="lg" />

      <VStack
        marginVertical="auto"
        maxWidth={props.isLast ? 'auto' : 320}
        paddingLeft={100}
        {...(props.position === 'right' && {
          paddingLeft: 0,
          paddingRight: 120,
        })}
        {...(props.position === 'below' && {
          paddingLeft: 0,
          paddingRight: 0,
        })}
      >
        <Paragraph size="md">{props.content}</Paragraph>
      </VStack>

      <VStack
        position="absolute"
        top={80}
        left={-50}
        backgroundColor="#000"
        borderRadius={15}
        paddingVertical={6}
        paddingHorizontal={2}
        {...(props.position === 'right' && {
          right: -50,
          left: 'auto',
        })}
        {...(props.position === 'below' && {
          right: 'auto',
          left: 'auto',
          top: 'auto',
          bottom: -200,
        })}
      >
        <VStack borderRadius={13} overflow="hidden">
          <Image source={{ uri: props.image }} style={{ width: 380 / 2.5, height: 774 / 2.5 }} />
        </VStack>
      </VStack>
    </VStack>
  )
}

const SignupBetaForm = () => {
  const { onChange, onSubmit, control, errors, isSubmitting, errorMessage } = useFormAction({
    name: 'register',
    initialValues: {
      username: '',
      password: '',
      email: '',
    },
    submit: () => {},
  })

  return (
    <VStack alignItems="center" justifyContent="center" flex={1}>
      <SubmittableForm
        errorText={errorMessage}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        submitText="Signup"
      >
        <Paragraph fontWeight="800" size="sm">
          Email:
        </Paragraph>
        <ValidatedInput
          control={control}
          errors={errors.email}
          name="email"
          spellCheck={false}
          placeholder="Enter your email..."
          autoCapitalize="none"
          autoFocus
          onChangeText={onChange('email')}
          rules={{
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'invalid email address',
            },
          }}
        />
      </SubmittableForm>
    </VStack>
  )
}
