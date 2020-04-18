import React from 'react'
import { StyleSheet } from 'react-native'

import { searchBarHeight } from '../../constants'
import {
  drawerBorderRadius,
  drawerPad,
  drawerPadLeft,
  drawerWidthMax,
} from '../../constants'
import { useMedia } from '../../hooks/useMedia'
import { LinearGradient } from '../ui/LinearGradient'
import { mediaQueries } from '../ui/MediaQuery'
import { Spacer } from '../ui/Spacer'
import { HStack, StackProps, VStack, ZStack } from '../ui/Stacks'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

const colors = [
  'rgba(255,255,255,0.15)',
  'rgba(255,255,255,0.9)', //rgba(255,255,255,0.9)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.95)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.95)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.99)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.95)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.9)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.9)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.9)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.888)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.777)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.666)',
  'rgba(255,255,255,1)', //'rgba(255,255,255,0.666)',
  'rgba(255,255,255,0.5)', //'rgba(255,255,255,0.666)',
]

const colorsSmall = colors.slice(2)

export const useIsSmall = () => useMedia({ maxWidth: 700 })

export function HomeViewDrawer(props: { children: any }) {
  const isSmall = useIsSmall()
  const drawerWidth = useHomeDrawerWidth()

  const positionSmall: StackProps = {
    top: '28%',
    left: 0,
    right: 0,
    width: '100%',
    paddingTop: 0,
  }

  const topOffset = isSmall ? 0 : searchBarHeight

  const leftGradient = (
    <LinearGradient
      colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
      style={[StyleSheet.absoluteFill]}
      startPoint={[0, 0]}
      endPoint={[100, 0]}
    />
  )

  const gradients = [
    <LinearGradient
      key={0}
      colors={isSmall ? colorsSmall : colors}
      style={[StyleSheet.absoluteFill]}
    />,
    <ZStack key={1} fullscreen right={850}>
      {leftGradient}
    </ZStack>,
  ]

  return (
    <HStack
      position="absolute"
      top={0}
      paddingTop={drawerPad}
      left={-drawerPad}
      bottom={0}
      zIndex={10}
      width={drawerWidth + drawerPadLeft}
      // minWidth="50%"
      shadowColor="rgba(0,0,0,0.1)"
      shadowRadius={44}
      // borderRightWidth={1}
      // borderBottomRightRadius={drawerBorderRadius}
      borderColor="#ddd"
      flex={1}
      justifyContent="flex-end"
      {...(isSmall && positionSmall)}
    >
      <ZStack fullscreen>
        <ZStack
          fullscreen
          // borderBottomRightRadius={drawerBorderRadius}
          overflow="hidden"
        >
          {gradients}
        </ZStack>
      </ZStack>
      <VStack
        flex={1}
        paddingLeft={drawerPad}
        maxWidth={drawerWidthMax}
        marginLeft="auto"
      >
        <ZStack position="relative" flex={1}>
          <VStack
            position="absolute"
            top={topOffset}
            left={0}
            right={0}
            bottom={0}
            flex={1}
          >
            {props.children}
          </VStack>
        </ZStack>
      </VStack>
    </HStack>
  )
}
