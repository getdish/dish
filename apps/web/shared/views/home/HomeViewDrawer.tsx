import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet } from 'react-native'

import { drawerBorderRadius, drawerPad, drawerPadLeft } from '../../constants'
import { Spacer } from '../shared/Spacer'
import { VStack, ZStack } from '../shared/Stacks'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

const colors = [
  'rgba(255,255,255,0.3)',
  'rgba(255,255,255,1)',
  'rgba(255,255,255,1)',
  'rgba(255,255,255,1)',
  'rgba(255,255,255,1)',
  'rgba(255,255,255,1)',
  'rgba(255,255,255,1)',
  'rgba(255,255,255,1)',
  'rgba(255,255,255,1)',
  'rgba(255,255,255,1)',
  'rgba(255,255,255,1)',
  'rgba(255,255,255,1)',
]

export function HomeViewDrawer(props: { children: any }) {
  const drawerWidth = useHomeDrawerWidth()
  return (
    <VStack
      position="absolute"
      top={50}
      left={drawerPadLeft}
      bottom={drawerPad}
      zIndex={10}
      width={drawerWidth}
      borderRadius={drawerBorderRadius}
      shadowColor="rgba(0,0,0,0.22)"
      shadowRadius={24}
      borderWidth={1}
      borderColor="rgba(255,255,255,0.6)"
      flex={1}
    >
      <ZStack fullscreen borderRadius={drawerBorderRadius} overflow="hidden">
        <LinearGradient colors={colors} style={[StyleSheet.absoluteFill]} />
      </ZStack>
      <VStack flex={1} marginTop={-50 + drawerPad}>
        {props.children}
      </VStack>
    </VStack>
  )
}
