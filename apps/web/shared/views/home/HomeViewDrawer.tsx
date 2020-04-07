import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { StyleSheet } from 'react-native'

import { drawerBorderRadius, drawerPad, drawerPadLeft } from '../../constants'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

const colors = [
  'rgba(255,255,255,0.23)',
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
  // 'rgba(255,255,255,0.5)',
]

export function HomeViewDrawer(props: { children: any }) {
  const drawerWidth = useHomeDrawerWidth()
  return (
    <HStack
      position="absolute"
      top={0}
      left={0}
      // paddingLeft={drawerPad}
      paddingBottom={drawerPad}
      bottom={0}
      zIndex={10}
      width={drawerWidth + drawerPadLeft}
      // borderRadius={drawerBorderRadius}
      // shadowColor="rgba(0,0,0,0.2)"
      // shadowRadius={44}
      borderRightWidth={1}
      borderColor="#ddd"
      flex={1}
      justifyContent="flex-end"
    >
      <ZStack fullscreen>
        <ZStack fullscreen>
          <LinearGradient colors={colors} style={[StyleSheet.absoluteFill]} />

          <ZStack fullscreen right={550}>
            <LinearGradient
              colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
              style={[StyleSheet.absoluteFill]}
              start={{ x: 0, y: 0 }}
              end={{ x: 100, y: 0 }}
            />
          </ZStack>
        </ZStack>
      </ZStack>
      <VStack flex={1} marginTop={drawerPad} maxWidth={650} marginLeft="auto">
        {props.children}
      </VStack>
    </HStack>
  )
}
