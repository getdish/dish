import { reaction } from '@dish/use-store'
import React, { Suspense, memo, useEffect } from 'react'
import { StyleSheet } from 'react-native'
// import { createReparentableSpace } from 'react-reparenting'
import { AbsoluteVStack, HStack, LinearGradient, VStack, useMedia, useTheme } from 'snackui'

import { searchBarHeight, zIndexDrawer } from '../../constants/constants'
import { router } from '../../router'
import { AppAutocompleteSearch } from '../AppAutocomplete'
import { appMenuStore } from '../AppMenuStore'
import { homeStore } from '../homeStore'
import { useAppDrawerWidth } from '../hooks/useAppDrawerWidth'
import { useLastValueWhen } from '../hooks/useLastValueWhen'
import { DrawerPortalProvider } from '../Portal'
import { HomeDrawerSmall } from './HomeDrawerSmall'
import { HomeStackView } from './HomeStackView'
import { HomeStackViewPages } from './HomeStackViewPages'

export const Home = memo(function Home() {
  // helper that warns on root level unmounts (uncaught suspense)
  if (process.env.NODE_ENV === 'development') {
    useEffect(() => {
      return () => {
        console.warn('\n\nUNCAUGHT SUSPENSE SOMEWHERE -- FIX IT!!\n\ns')
      }
    }, [])
  }

  useEffect(() => {
    return reaction(
      homeStore,
      (x) => {
        if (x.currentState.type === 'home' || x.currentState.type === 'search') {
          return x.currentState
        }
        return null
      },
      function updateAreaInfo(positionedState) {
        if (!positionedState) return
        homeStore.updateAreaInfo()
      }
    )
  }, [])

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
    <AbsoluteVStack fullscreen pointerEvents="none" zIndex={zIndexDrawer}>
      {media.sm && <HomeDrawerSmall>{props.children}</HomeDrawerSmall>}
      {!media.sm && <HomeContainerLarge>{props.children}</HomeContainerLarge>}
      {/* <HomeDrawerSmall>
        <Reparentable id="sm">{parent === 'sm' ? children : []}</Reparentable>
      </HomeDrawerSmall>

      <HomeContainerLarge>
        <Reparentable id="lg">{parent === 'lg' ? children : []}</Reparentable>
      </HomeContainerLarge> */}
    </AbsoluteVStack>
  )
}

export const HomeContainerLarge = (props) => {
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
        shadowRadius={15}
        shadowOffset={{ width: 10, height: 0 }}
        justifyContent="flex-end"
      >
        <UnderFade />

        <VStack flex={1} maxWidth="100%" marginLeft="auto" position="relative" opacity={1}>
          <AbsoluteVStack
            zIndex={100000000}
            pointerEvents="none"
            left={0}
            right={0}
            bottom={0}
            top={searchBarHeight}
          >
            <AppAutocompleteSearch />
          </AbsoluteVStack>

          {props.children}

          <DrawerPortalProvider />
        </VStack>
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
