import { drawerWidthMax, pageWidthMax, zIndexDrawer } from '../../constants/constants'
import { router } from '../../router'
import { AppMapControls } from '../AppMapControls'
import { appMenuStore } from '../AppMenuStore'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { DrawerPortalProvider } from '../Portal'
import { HomeStackView } from './HomeStackView'
import { HomeStackViewPages } from './HomeStackViewPages'
import { Spacer, XStack, YStack, styled, useMedia } from '@dish/ui'
import { reaction } from '@dish/use-store'
import React, { Suspense, memo, useEffect } from 'react'

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
      {media.md && <HomeDrawerSmall key={0}>{contents}</HomeDrawerSmall>}
      {!media.md && <HomeDrawerLarge key={1}>{contents}</HomeDrawerLarge>}
    </Suspense>
  )
})

const HomeDrawerSmall = (props: { children: any }) => {
  return (
    <YStack pe="none" pos="relative" zi={100000000000}>
      <Spacer pe="none" size={400} />
      <DrawerFrame>
        <DrawerFrameBg />
        {props.children}
      </DrawerFrame>
    </YStack>
  )
}

const HomeDrawerLarge = memo((props: any) => {
  return (
    <>
      <XStack
        // fullscreen
        pos="relative"
        margin="auto"
        maxWidth={pageWidthMax}
        f={1}
        p="$2"
        pe="none"
        ai="flex-start"
        zi={zIndexDrawer}
      >
        <YStack f={1} w="100%" maxWidth="60%">
          <DrawerFrame>
            <DrawerFrameBg />
            <AppSearchBarInline />
            {props.children}
            <DrawerPortalProvider />
          </DrawerFrame>
        </YStack>

        <YStack ov="hidden" pos="relative" f={1} h="100%" px="$4">
          <YStack pos="relative" f={1}>
            <AppMapControls />
          </YStack>
        </YStack>
      </XStack>
    </>
  )
})

const DrawerFrameBg = styled(YStack, {
  opacity: 0.2,
  zi: -1,
  fullscreen: true,
  br: '$6',
  backgroundColor: '$background',
})

const DrawerFrame = styled(YStack, {
  pos: 'relative',
  className: 'blur',
  bc: '$backgroundDrawer',
  br: '$6',
  pointerEvents: 'auto',
  maxWidth: drawerWidthMax,
  f: 1,
  zIndex: 10,
  flex: 1,
  shadowColor: 'rgba(0,0,0,0.135)',
  shadowRadius: 7,
  shadowOffset: {
    height: 4,
    width: 0,
  },
  bw: 1,
  boc: '$borderColor',
  justifyContent: 'flex-end',
})
