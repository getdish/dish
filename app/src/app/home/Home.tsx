import { drawerWidthMax, pageWidthMax, zIndexDrawer } from '../../constants/constants'
import { router } from '../../router'
import { AppMapControls } from '../AppMapControls'
import { appMenuStore } from '../AppMenuStore'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { autocompletesStore } from '../AutocompletesStore'
import { DrawerPortalProvider } from '../Portal'
import { drawerStore } from '../drawerStore'
import { useAppDrawerWidth } from '../hooks/useAppDrawerWidth'
import { AppFloatingTagMenuBar } from './AppFloatingTagMenuBar'
import { HomeDrawerSmallView } from './HomeDrawerSmallView'
import { HomeDrawerSmallView as HomeDrawerSmallViewNative } from './HomeDrawerSmallView.native'
import { HomeStackView } from './HomeStackView'
import { HomeStackViewPages } from './HomeStackViewPages'
import { LinearGradient, XStack, YStack, useIsTouchDevice, useMedia, useTheme } from '@dish/ui'
import { reaction } from '@dish/use-store'
import React, { Suspense, memo, useEffect } from 'react'
import { Keyboard } from 'react-native'

export const Home = memo(function Home() {
  const media = useMedia()

  // helper that warns on root level unmounts (uncaught suspense)
  if (process.env.NODE_ENV === 'development') {
    useEffect(() => {
      return () => {
        console.warn('🏡🏡🏡 Home UNCAUGHT SUSPENSE SOMEWHERE -- FIX IT!!\n\ns')
      }
    }, [])
  }

  useEffect(() => {
    return reaction(
      router as any,
      (x) => {
        return x.curPage.name
      },
      function appMenuShow(name) {
        if (name == 'login' || name == 'register' || name == 'passwordReset') {
          appMenuStore.show()
        }
      }
    )
  }, [])

  const contents = (
    <YStack f={1}>
      <HomeStackView>
        {(props) => {
          return <HomeStackViewPages {...props} />
        }}
      </HomeStackView>
    </YStack>
  )

  return (
    <Suspense fallback={null}>
      {media.sm && <HomeDrawerSmall>{contents}</HomeDrawerSmall>}
      {!media.sm && <HomeDrawerLarge>{contents}</HomeDrawerLarge>}
    </Suspense>
  )
})

const HomeDrawerSmall = (props: { children: any }) => {
  const isTouchDevice = useIsTouchDevice()

  useEffect(() => {
    return reaction(
      autocompletesStore,
      (x) => x.visible,
      function autocompleteVisibleToSnapAndKeyboard(visible) {
        if (visible === true) {
          if (drawerStore.snapIndex !== 0) {
            drawerStore.setSnapIndex(0)
          }
        } else {
          Keyboard.dismiss()
          if (drawerStore.isDragging) {
            return
          }
          if (drawerStore.snapIndex !== 1) {
            drawerStore.setSnapIndex(1)
          }
        }
      }
    )
  }, [])

  if (true) {
    return <HomeDrawerSmallViewNative {...props} />
  }

  return (
    <>
      <HomeDrawerSmallView {...props} />
    </>
  )
}

const HomeDrawerLarge = memo((props) => {
  return (
    <XStack
      fullscreen
      margin="auto"
      maxWidth={pageWidthMax}
      f={1}
      p="absolute"
      top="$2"
      left="$2"
      bottom="$2"
      pe="none"
      ai="flex-start"
      zi={zIndexDrawer}
    >
      <YStack h="100%" f={1} w="100%" maxWidth="60%">
        <YStack
          pos="relative"
          className="blur"
          bc="$backgroundDrawer"
          br="$6"
          pointerEvents="auto"
          maxWidth={drawerWidthMax}
          f={1}
          zIndex={10}
          flex={1}
          shadowColor="rgba(0,0,0,0.135)"
          shadowRadius={7}
          shadowOffset={{
            height: 4,
            width: 0,
          }}
          bw={1}
          boc="$borderColor"
          justifyContent="flex-end"
        >
          {/* <XStack opacity={0.5} zi={-1} fullscreen br="$6" backgroundColor="$background" /> */}

          <AppSearchBarInline />

          {props.children}

          <DrawerPortalProvider />
        </YStack>
      </YStack>

      <YStack ov="hidden" pos="relative" f={1} h="100%" px="$4">
        <YStack pos="relative" f={1}>
          <AppMapControls />
        </YStack>
      </YStack>
    </XStack>
  )
})
