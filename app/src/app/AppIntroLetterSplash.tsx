import { useQueryLoud } from '../helpers/useQueryLoud'
import { IntroModalStore } from './IntroModalStore'
import { UserOnboard } from './UserOnboard'
import { useFormAction } from './hooks/useFormAction'
import { useLocalStorageState } from './hooks/useLocalStorageState'
import { useUserStore } from './userStore'
import { CloseButton, SmallCircleButton } from './views/CloseButton'
import { DarkModal } from './views/DarkModal'
import { SubmittableForm, ValidatedInput } from './views/Form'
import { Image } from './views/Image'
import { LogoColor } from './views/Logo'
import { PageHead } from './views/PageHead'
import { PaneControlButtons } from './views/PaneControlButtons'
import { SlantedTitle } from './views/SlantedTitle'
import {
  AbsoluteYStack,
  Button,
  LinearGradient,
  Modal,
  Paragraph,
  Spacer,
  Text,
  Theme,
  YStack,
  useMedia,
  useTheme,
} from '@dish/ui'
import { useStore } from '@dish/use-store'
import { Home } from '@tamagui/feather-icons'
import React, { memo, useLayoutEffect, useMemo, useState } from 'react'
import { StyleSheet } from 'react-native'

export const AppIntroLetter = memo(() => {
  const [showSignup, setShowSignup] = useState(false)
  const userStore = useUserStore()
  const [closes, setCloses] = useLocalStorageState('modal-intro-closes', 0)
  const hasOnboarded = userStore.user?.has_onboarded
  const isLoggedIn = userStore.isLoggedIn
  const store = useStore(IntroModalStore)
  const media = useMedia()
  const theme = useTheme()
  const countries = useQueryLoud(
    'countries',
    () => fetch('/api/countries').then((res) => res.json()),
    {
      suspense: false,
    }
  )

  const features = useMemo(() => countries.data?.features ?? [], [countries.data])

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

  if (isLoggedIn) {
    return null
  }

  return (
    <>
      <PageHead isActive={!store.hidden} color="#000">
        Welcome to Dish
      </PageHead>

      <Theme name="dark">
        <Modal
          visible={showSignup}
          onDismiss={() => setShowSignup(false)}
          flex={1}
          paddingHorizontal={20}
          paddingVertical={20}
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
        <AbsoluteYStack top={90} pointerEvents="none" zIndex={-1}>
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
          />
        </AbsoluteYStack>

        <YStack
          paddingVertical={20}
          paddingHorizontal={20}
          maxWidth={940}
          alignItems="center"
          minHeight="100%"
          space="$8"
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

          <Button
            theme="active"
            paddingVertical={12}
            paddingHorizontal={20}
            elevation="$3"
            borderRadius={100}
            fontSize={16}
            fontWeight="800"
            onPress={() => setShowSignup(true)}
          >
            Sign up &nbsp; ✨
          </Button>

          <Text
            color={theme.color}
            textAlign="center"
            fontSize={media.sm ? 22 : 30}
            marginHorizontal="7%"
            fontWeight="700"
            selectable
          >
            Better adventure, or just better pho.
          </Text>

          <Text
            color={theme.color}
            textAlign="center"
            fontSize={media.sm ? 22 : 28}
            marginHorizontal="7%"
            lineHeight={media.sm ? 30 : 40}
            fontWeight="300"
            selectable
            opacity={0.8}
          >
            Dish is a better map for curation - for travelers, foodies, or people who just like
            finding great things.
          </Text>

          <Spacer size="$4" />
          {/* 
          <XStack marginBottom={-20} flexWrap="wrap" alignItems="center" justifyContent="center">
            <GridItem
              title="Discover"
              content="Better reviews of every restaurant - search across delivery, by dish and more."
              color={blue}
              image={iphoneScreen}
              position="right"
            />

            <GridItem
              title="Collect"
              content="List your favorite nights out, plan a trip, and share favorites with friends."
              color={green}
              image={iphoneScreen}
              position="right"
            />

            <GridItem
              title="Earn"
              color={pink}
              content="Curators and contributors earn for lists, photos and reviews."
              image={iphoneScreen}
              position="right"
            />
          </XStack> */}
        </YStack>
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
//           <AbsoluteYStack
//             pointerEvents="none"
//             bottom={-10}
//             zIndex={1000}
//             right={-40}
//             rotate="-10deg"
//           >
//             <Text fontSize={62}>🌮</Text>
//           </AbsoluteYStack>
//           <AbsoluteYStack pointerEvents="none" bottom={-10} zIndex={1000} left={-40} rotate="10deg">
//             <Text fontSize={62}>🍜</Text>
//           </AbsoluteYStack>
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
    <YStack
      minWidth={250}
      minHeight={220}
      borderRadius={30}
      padding={20}
      overflow="hidden"
      marginBottom={10}
      marginHorizontal={5}
      position="relative"
      flexShrink={1}
      flexGrow={0}
      {...(props.position === 'below' && {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 120,
      })}
    >
      <AbsoluteYStack fullscreen backgroundColor={props.color} zIndex={0} opacity={0.2} />

      <Text
        color={theme.color}
        textAlign="center"
        fontSize={media.sm ? 22 : 24}
        fontWeight="800"
        selectable
      >
        {props.title}
      </Text>

      <Spacer size="$6" />

      <YStack
        marginVertical="auto"
        maxWidth={media.sm ? '90%' : 250}
        paddingLeft={110}
        {...(props.position === 'right' && {
          paddingLeft: 0,
          paddingRight: 120,
        })}
        {...(props.position === 'below' && {
          paddingLeft: 0,
          paddingRight: 0,
        })}
      >
        <Paragraph flexShrink={1} size="$4">
          {props.content}
        </Paragraph>
      </YStack>

      <YStack
        position="absolute"
        top={80}
        left={-50}
        pointerEvents="none"
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
        <YStack borderRadius={13} overflow="hidden">
          <Image source={{ uri: props.image }} style={{ width: 380 / 2.5, height: 774 / 2.5 }} />
        </YStack>
      </YStack>
    </YStack>
  )
}

const SignupBetaForm = () => {
  const { onChange, onSubmit, control, errors, isSubmitting, errorMessage } = useFormAction({
    name: 'beta-register',
    initialValues: {
      username: '',
      password: '',
      email: '',
    },
    submit: async () => {
      console.warn('todo')
    },
  })

  return (
    <YStack alignItems="center" justifyContent="center" flex={1}>
      <SubmittableForm
        errorText={errorMessage}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        submitText="Signup"
      >
        <Paragraph fontWeight="800" size="$2">
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
    </YStack>
  )
}
