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
  drawerPadLeft,
  drawerWidthMax,
} from '../../constants'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

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
      width={drawerWidth + drawerPadLeft}
      // minWidth="50%"
      shadowColor="rgba(0,0,0,0.1)"
      shadowRadius={44}
      borderRightWidth={1}
      borderBottomRightRadius={drawerBorderRadius * 1.5}
      borderTopRightRadius={drawerBorderRadius * 1.5}
      // overflow="hidden"
      borderColor="#ddd"
      flex={1}
      justifyContent="flex-end"
      {...(isSmall && positionSmall)}
    >
      {/* background */}
      <ZStack fullscreen>
        <ZStack
          fullscreen
          borderBottomRightRadius={drawerBorderRadius * 0.5}
          borderTopRightRadius={drawerBorderRadius * 0.5}
          overflow="hidden"
        >
          <LinearGradient
            colors={isSmall ? colorsSmall : colors}
            style={[StyleSheet.absoluteFill]}
          />
          <ZStack key={1} fullscreen right={200}>
            <LinearGradient
              colors={['white', 'white', 'rgba(255,255,255,0)']}
              style={[StyleSheet.absoluteFill]}
              startPoint={[0, 0]}
              endPoint={[1, 0]}
            />
          </ZStack>
        </ZStack>
      </ZStack>

      {/* overlay / under searchbar */}
      <ZStack
        pointerEvents="none"
        fullscreen
        zIndex={1000000}
        bottom="auto"
        height={100}
      >
        <LinearGradient
          colors={['white', 'transparent']}
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
          <VStack fullscreen flex={1}>
            <LinearGradient
              colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                left: -800,
                height: 80,
              }}
            />
            {props.children}
          </VStack>
        </ZStack>
      </VStack>
    </HStack>
  )
}
