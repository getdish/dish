import {
  drawerWidthMax,
  isWeb,
  pageWidthMax,
  searchBarHeight,
  zIndexDrawer,
} from '../../constants/constants'
import { router } from '../../router'
import { AppAutocompleteLocation } from '../AppAutocompleteLocation'
import { AppAutocompleteSearch } from '../AppAutocompleteSearch'
import { appMenuStore } from '../AppMenuStore'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { autocompletesStore } from '../AutocompletesStore'
import { DrawerPortalProvider } from '../Portal'
import { drawerStore } from '../drawerStore'
import { useAppDrawerWidth } from '../hooks/useAppDrawerWidth'
import { useLastValueWhen } from '../hooks/useLastValueWhen'
import { HomeDrawerSmallView } from './HomeDrawerSmallView'
import { HomeDrawerSmallView as HomeDrawerSmallViewNative } from './HomeDrawerSmallView.native'
import { HomeStackView } from './HomeStackView'
import { HomeStackViewPages } from './HomeStackViewPages'
import {
  Circle,
  LinearGradient,
  XStack,
  YStack,
  supportsTouchWeb,
  useMedia,
  useTheme,
} from '@dish/ui'
import { reaction } from '@dish/use-store'
import React, { Suspense, memo, useEffect } from 'react'
import { Keyboard, StyleSheet } from 'react-native'

export const Home = memo(function Home() {
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

  return (
    <Suspense fallback={null}>
      <HomeContainer>
        <HomeStackView>
          {(props) => {
            return <HomeStackViewPages {...props} />
          }}
        </HomeStackView>
      </HomeContainer>
    </Suspense>
  )
})

// const { Reparentable, sendReparentableChild } = createReparentableSpace()

export function HomeContainer(props: { children: any }) {
  const media = useMedia()
  // const [parent, setParent] = useState(() => (media.sm ? 'sm' : 'lg'))
  // const children = [<React.Fragment key="1">{props.children}</React.Fragment>]

  // useLayoutEffect(() => {
  //   setParent((last) => {
  //     const next = media.sm ? 'sm' : 'lg'
  //     sendReparentableChild(last, next, 0, 0)
  //     return next
  //   })
  // }, [media.sm])

  return (
    <>
      {media.sm && <HomeDrawerSmall>{props.children}</HomeDrawerSmall>}
      {!media.sm && <HomeContainerLarge>{props.children}</HomeContainerLarge>}
      {/* <HomeDrawerSmall>
        <Reparentable id="sm">{parent === 'sm' ? children : []}</Reparentable>
      </HomeDrawerSmall>

      <HomeContainerLarge>
        <Reparentable id="lg">{parent === 'lg' ? children : []}</Reparentable>
      </HomeContainerLarge> */}
    </>
  )
}

const HomeDrawerSmall = (props: { children: any }) => {
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

  if (!isWeb || supportsTouchWeb) {
    return <HomeDrawerSmallViewNative {...props} />
  }

  return (
    <>
      <HomeDrawerSmallView {...props} />
    </>
  )
}

const HomeContainerLarge = memo((props) => {
  const drawerWidth = useAppDrawerWidth(Infinity)
  console.log('drawerWidth', drawerWidth)
  // const lastWidth = useLastValueWhen(() => drawerWidth, media.sm)

  return (
    <YStack
      fullscreen
      margin="auto"
      maxWidth={pageWidthMax}
      // TODO ui-static this fails if i remove conditional above!
      f={1}
      p="absolute"
      top={0}
      pe="none"
      ai="flex-start"
      zi={zIndexDrawer}
    >
      <YStack
        className="blur"
        br="$4"
        pointerEvents="auto"
        position="absolute"
        top="$3"
        left="$3"
        bottom="$3"
        width={drawerWidth}
        zIndex={10}
        flex={1}
        shadowColor="$shadowColor"
        shadowRadius={25}
        shadowOffset={{ width: 10, height: 0 }}
        justifyContent="flex-end"
        $gtSm={{
          marginLeft: 'auto',
          maxWidth: drawerWidthMax,
        }}
      >
        <XStack opacity={0.5} zi={-1} fullscreen br="$4" backgroundColor="$background" />

        <XStack
          pe="none"
          br="$4"
          overflow="hidden"
          zi={100}
          pos="absolute"
          top={0}
          left={0}
          right={0}
          height={100}
          ai="flex-start"
        >
          <AppSearchBarInline />
          <AppSearchBarFade />
        </XStack>

        <XStack pos="absolute" fullscreen top={searchBarHeight}>
          <AppAutocompleteSearch />
          <AppAutocompleteLocation />
        </XStack>

        {props.children}

        <DrawerPortalProvider />
      </YStack>
    </YStack>
  )
})

const AppSearchBarFade = () => {
  const theme = useTheme()

  return (
    <LinearGradient
      // TODO need to dedupe react-native when linked in or else absolutefill breaks
      style={[{ top: 0, right: 0, bottom: 0, left: 0, position: 'absolute', zIndex: -1 }]}
      // start={[0, 0]}
      // end={[0, 1]}
      colors={[theme.background.toString(), theme.backgroundTransparent.toString()]}
    />
  )
}
