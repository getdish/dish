import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  StackProps,
  VStack,
  useMedia,
} from '@dish/ui'
import React from 'react'
import { StyleSheet } from 'react-native'

import {
  drawerBorderRadius,
  drawerPad,
  drawerWidthMax,
  searchBarHeight,
} from '../../constants'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

const bgColor = 'rgb(255,255,255)'

const colors = [
  'rgba(255,255,255,0.15)',
  'rgba(255,255,255,0.9)', //rgba(255,255,255,0.9)',
  'rgba(255,255,255,0.95)', //'rgba(255,255,255,0.95)',
  'rgba(255,255,255,0.95)', //'rgba(255,255,255,0.95)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.99)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.95)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.9)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.9)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.9)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.888)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.777)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.666)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.666)',
  // 'rgba(255,255,255,0.5)', //'rgba(255,255,255,0.666)',
]

const colorsSmall = colors.slice(2)

export const useMediaQueryIsSmall = () => useMedia({ maxWidth: 860 })
export const useMediaQueryIsMedium = () => useMedia({ maxWidth: 960 })

export function HomeViewDrawer(props: { children: any }) {
  const isSmall = useMediaQueryIsSmall()
  const drawerWidth = useHomeDrawerWidth()

  return (
    <HStack
      position="absolute"
      top={0}
      bottom={0}
      zIndex={10}
      width={isSmall ? '100%' : drawerWidth}
      shadowColor="rgba(0,0,0,0.18)"
      shadowRadius={44}
      backgroundColor="#fff"
      // borderRightWidth={1}
      // borderColor="#ddd"
      borderBottomRightRadius={drawerBorderRadius * 1.5}
      borderTopRightRadius={drawerBorderRadius * 1.5}
      flex={1}
      justifyContent="flex-end"
      {...(isSmall && {
        top: '24%',
        left: 0,
        right: 0,
        // TODO ui-static this fails if i remove conditional above!
        width: '100%',
        paddingTop: 0,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        overflow: 'hidden',
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
          colors={['white', 'rgba(255,255,255,0)']}
          style={[StyleSheet.absoluteFill]}
        />
      </AbsoluteVStack>

      <VStack
        flex={1}
        paddingLeft={isSmall ? 0 : drawerPad}
        maxWidth={isSmall ? '100%' : drawerWidthMax}
        marginLeft={isSmall ? 0 : 'auto'}
      >
        <AbsoluteVStack position="relative" flex={1}>
          {/* <LinearGradient
              colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: -800,
                height: 80,
              }}
            /> */}
          {props.children}
        </AbsoluteVStack>
      </VStack>
    </HStack>
  )
}
