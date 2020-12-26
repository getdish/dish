import React, { memo } from 'react'
import { StyleSheet } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import AppAutocomplete from './AppAutocomplete'
import { AppSmallDrawer } from './AppSmallDrawer'
import { searchBarHeight, zIndexDrawer } from './constants'
import { useAppDrawerWidth } from './hooks/useAppDrawerWidth'
import { useLastValueWhen } from './hooks/useLastValueWhen'

// import { Reparentable, sendReparentableChild } from 'react-reparenting'
// const getParent = (isSmall: boolean) => (isSmall ? 'sm' : 'lg')

export function AppContainer(props: { children: any }) {
  const media = useMedia()
  // const [parent, setParent] = useState()
  // const children = [<React.Fragment key="1">{props.children}</React.Fragment>]

  // useEffect(() => {
  //   setParent((last) => {
  //     const next = getParent(isSmall)
  //     sendReparentableChild(last, next, 0, 0)
  //     return next
  //   })
  // }, [isSmall])

  return (
    <AbsoluteVStack fullscreen pointerEvents="none" zIndex={zIndexDrawer}>
      {media.sm && <AppSmallDrawer>{props.children}</AppSmallDrawer>}
      {!media.sm && <HomeContainerLarge>{props.children}</HomeContainerLarge>}
      {/* {getParent(isSmall)} */}
      {/* <AppSmallDrawer>
        <Reparentable id="sm">{parent === 'sm' ? children : []}</Reparentable>
      </AppSmallDrawer>

      <HomeContainerLarge>
        <Reparentable id="lg">{parent === 'lg' ? children : []}</Reparentable>
      </HomeContainerLarge> */}
    </AbsoluteVStack>
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
        shadowColor="rgba(0,0,0,0.08)"
        shadowRadius={10}
        shadowOffset={{ width: 10, height: 0 }}
        justifyContent="flex-end"
      >
        <UnderFade />

        <VStack
          flex={1}
          maxWidth="100%"
          marginLeft="auto"
          position="relative"
          opacity={1}
        >
          <AbsoluteVStack left={0} right={0} bottom={0} top={searchBarHeight}>
            <AppAutocomplete />
          </AbsoluteVStack>
          {props.children}
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
