import {
  HStack,
  LinearGradient,
  StackProps,
  VStack,
  ZStack,
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

  const positionSmall: StackProps = {
    top: '24%',
    left: 0,
    right: 0,
    width: '100%',
    paddingTop: 0,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    overflow: 'hidden',
  }

  return (
    <HStack
      position="absolute"
      top={0}
      bottom={0}
      zIndex={10}
      width={drawerWidth}
      shadowColor="rgba(0,0,0,0.25)"
      shadowRadius={44}
      backgroundColor="#fff"
      // borderRightWidth={1}
      // borderColor="#ddd"
      borderBottomRightRadius={drawerBorderRadius * 1.5}
      borderTopRightRadius={drawerBorderRadius * 1.5}
      flex={1}
      justifyContent="flex-end"
      {...(isSmall && positionSmall)}
    >
      {/* overlay / under searchbar */}
      <ZStack
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
      </ZStack>

      <VStack
        flex={1}
        paddingLeft={drawerPad}
        maxWidth={isSmall ? '100%' : drawerWidthMax}
        marginLeft={isSmall ? 0 : 'auto'}
      >
        <ZStack position="relative" flex={1}>
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
        </ZStack>
      </VStack>
    </HStack>
  )
}
