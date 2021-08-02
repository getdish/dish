import { reaction } from '@dish/use-store'
import React, { Suspense, memo, useEffect } from 'react'
import { Keyboard, StyleSheet } from 'react-native'
// import { createReparentableSpace } from 'react-reparenting'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  VStack,
  supportsTouchWeb,
  useMedia,
  useTheme,
} from 'snackui'

import { isWeb, searchBarHeight, zIndexDrawer } from '../../constants/constants'
import { router } from '../../router'
import { AppAutocompleteSearch } from '../AppAutocompleteSearch'
import { appMenuStore } from '../AppMenuStore'
import { autocompletesStore } from '../AutocompletesStore'
import { drawerStore } from '../drawerStore'
import { homeStore } from '../homeStore'
import { useAppDrawerWidth } from '../hooks/useAppDrawerWidth'
import { useLastValueWhen } from '../hooks/useLastValueWhen'
import { DrawerPortalProvider } from '../Portal'
import { HomeDrawerSmallView } from './HomeDrawerSmallView'
import { HomeDrawerSmallView as HomeDrawerSmallViewNative } from './HomeDrawerSmallView.native'
import { HomeStackView } from './HomeStackView'
import { HomeStackViewPages } from './HomeStackViewPages'

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

const HomeContainerLarge = (props) => {
  const media = useMedia()
  const drawerWidth = useAppDrawerWidth(Infinity)
  const lastWidth = useLastValueWhen(() => drawerWidth, media.sm)
  const theme = useTheme()

  return (
    <VStack
      fullscreen
      display={media.sm ? 'none' : 'flex'}
      // TODO ui-static this fails if i remove conditional above!
      width={lastWidth}
      flex={1}
      position="absolute"
      top={0}
      pointerEvents="none"
      alignItems="flex-end"
      zIndex={zIndexDrawer}
    >
      <HStack
        pointerEvents="auto"
        position="absolute"
        top={0}
        bottom={0}
        zIndex={10}
        width="100%"
        flex={1}
        backgroundColor={theme.backgroundColor}
        shadowColor={theme.shadowColor}
        shadowRadius={25}
        shadowOffset={{ width: 10, height: 0 }}
        justifyContent="flex-end"
      >
        <UnderFade />
        <AppAutocompleteSearch />

        {props.children}

        <DrawerPortalProvider />
      </HStack>
    </VStack>
  )
}

const UnderFade = memo(() => {
  const theme = useTheme()
  const media = useMedia()
  return (
    <AbsoluteVStack
      opacity={media.sm ? 0 : 1}
      pointerEvents="none"
      fullscreen
      zIndex={1}
      bottom="auto"
      height={searchBarHeight + 20}
    >
      <LinearGradient
        colors={[theme.backgroundColor, theme.backgroundColorTransparent]}
        style={[StyleSheet.absoluteFill]}
      />
    </AbsoluteVStack>
  )
})
