import React from 'react'
import { drawerBorderRadius } from './HomeViewHome'
import { ZStack } from '../shared/Stacks'
import { StyleSheet, View } from 'react-native'
import { useWindowSize } from '../../hooks/useWindowSize'
import { HomeDrawerHeader } from './HomeDrawerHeader'
import { Color } from './Color'
import { BlurView } from './BlurView'

export function HomeViewDrawer(props: { children: any }) {
  const drawerWidth = useHomeDrawerWidth()
  return (
    <View
      style={[
        {
          position: 'absolute',
          top: 15,
          left: 25,
          bottom: 15,
          zIndex: 10,
          width: drawerWidth,
          borderRadius: drawerBorderRadius,
          shadowColor: 'rgba(0,0,0,0.25)',
          shadowRadius: 24,
          backgroundColor: 'rgba(250,250,250,0.8)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.5)',
          flex: 1,
        },
      ]}
    >
      {/* <ZStack fullscreen borderRadius={drawerBorderRadius} overflow="hidden">
        <BlurView />
      </ZStack> */}
      <HomeDrawerHeader />
      {props.children}
    </View>
  )
}

export function useHomeDrawerWidth(): number {
  const [width] = useWindowSize({ throttle: 100 })
  return Math.min(Math.max(400, width * 0.5), 600)
}
