import { AbsoluteVStack, HStack, LinearGradient, VStack } from '@dish/ui'
import React from 'react'
import { StyleSheet } from 'react-native'

import { bgAlt, bgLightTranslucent } from '../../colors'
import { drawerPad, drawerWidthMax, searchBarHeight } from '../../constants'
import { useOvermind } from '../../state/useOvermind'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export function HomeContainer(props: { children: any }) {
  const om = useOvermind()
  const isSmall = useMediaQueryIsSmall()
  const drawerWidth = useHomeDrawerWidth(Infinity)

  return (
    <VStack
      fullscreen
      // TODO ui-static this fails if i remove conditional above!
      width={isSmall ? '100%' : drawerWidth}
      flex={1}
      position="absolute"
      top={isSmall ? `${om.state.home.searchBarY}%` : 0}
      pointerEvents="none"
      alignItems="flex-end"
    >
      <HStack
        pointerEvents="auto"
        position="absolute"
        top={0}
        bottom={0}
        zIndex={10}
        shadowColor="rgba(0,0,0,0.13)"
        shadowRadius={44}
        width="100%"
        backgroundColor="#fff"
        shadowOffset={{ width: 10, height: 0 }}
        flex={1}
        justifyContent="flex-end"
        {...(isSmall && {
          paddingTop: 0,
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
          marginLeft: 0,
        })}
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

        {/* cross line */}
        <AbsoluteVStack fullscreen pointerEvents="none" overflow="hidden">
          <AbsoluteVStack
            height={400}
            width={2000}
            right="-10%"
            top="-20%"
            opacity={isSmall ? 0 : 1}
            backgroundColor={bgLightTranslucent}
            transform={[{ rotate: '-4deg' }]}
          />
        </AbsoluteVStack>

        <VStack
          flex={1}
          maxWidth="100%"
          marginLeft={isSmall ? 0 : 'auto'}
          position="relative"
        >
          {props.children}
        </VStack>
      </HStack>
    </VStack>
  )
}
