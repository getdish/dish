import { AbsoluteVStack, HStack, LinearGradient, VStack } from '@dish/ui'
import React from 'react'
import { StyleSheet } from 'react-native'

import { bgAlt, bgLightTranslucent } from '../../colors'
import { searchBarHeight, zIndexDrawer } from '../../constants'
import { HomeSmallDrawer } from './HomeSmallDrawer'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'
import { useIsNarrow } from './useIs'
import { useLastValueWhen } from './useLastValueWhen'

// import { Reparentable, sendReparentableChild } from 'react-reparenting'
// const getParent = (isSmall: boolean) => (isSmall ? 'sm' : 'lg')

export function HomeContainer(props: { children: any }) {
  const isSmall = useIsNarrow()
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
      {isSmall && <HomeSmallDrawer>{props.children}</HomeSmallDrawer>}
      {!isSmall && <HomeContainerLarge>{props.children}</HomeContainerLarge>}
      {/* {getParent(isSmall)} */}
      {/* <HomeSmallDrawer>
        <Reparentable id="sm">{parent === 'sm' ? children : []}</Reparentable>
      </HomeSmallDrawer>

      <HomeContainerLarge>
        <Reparentable id="lg">{parent === 'lg' ? children : []}</Reparentable>
      </HomeContainerLarge> */}
    </AbsoluteVStack>
  )
}

const HomeContainerLarge = (props) => {
  const isSmall = useIsNarrow()
  const drawerWidth = useHomeDrawerWidth(Infinity)
  const lastWidth = useLastValueWhen(() => drawerWidth, isSmall)

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
      className={isSmall ? 'invisible untouchable' : ''}
    >
      <HStack
        pointerEvents={isSmall ? 'none' : 'auto'}
        position="absolute"
        top={0}
        bottom={0}
        zIndex={10}
        width="100%"
        flex={1}
        backgroundColor="#fff"
        shadowColor="rgba(0,0,0,0.08)"
        shadowRadius={10}
        shadowOffset={{ width: 10, height: 0 }}
        justifyContent="flex-end"
      >
        {/* overlay / under searchbar */}
        <AbsoluteVStack
          opacity={isSmall ? 0 : 1}
          pointerEvents="none"
          fullscreen
          zIndex={1000000}
          bottom="auto"
          height={searchBarHeight + 20}
        >
          <LinearGradient
            colors={[bgAlt, 'rgba(255,255,255,0)']}
            style={[StyleSheet.absoluteFill]}
          />
        </AbsoluteVStack>

        <VStack
          flex={1}
          maxWidth="100%"
          marginLeft="auto"
          position="relative"
          opacity={1}
          {...(isSmall && {
            opacity: 0,
            pointerEvents: 'none',
          })}
        >
          {props.children}
        </VStack>
      </HStack>
    </VStack>
  )
}
