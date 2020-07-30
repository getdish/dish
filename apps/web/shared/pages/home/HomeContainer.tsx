import { AbsoluteVStack, HStack, LinearGradient, VStack } from '@dish/ui'
import React, { useEffect, useRef } from 'react'
import { Animated, PanResponder, StyleSheet } from 'react-native'

import { bgAlt, bgLightTranslucent } from '../../colors'
import { drawerPad, searchBarHeight } from '../../constants'
import { useOvermind } from '../../state/useOvermind'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export function HomeContainer(props: { children: any }) {
  const om = useOvermind()
  const isSmall = useMediaQueryIsSmall()
  const drawerWidth = useHomeDrawerWidth(Infinity)

  const pan = useRef(new Animated.ValueXY()).current
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        console.log('setting')
        pan.setOffset({
          x: pan.x['_value'],
          y: pan.y['_value'],
        })
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
      onPanResponderRelease: () => {
        pan.flattenOffset()
      },
    })
  ).current

  console.log(panResponder.panHandlers)

  useEffect(() => {
    setTimeout(() => {
      console.log('set offset')
      pan.setOffset({
        x: 0,
        y: 200,
      })
    }, 1000)
  }, [])

  return (
    <Animated.View
      style={{
        transform: [{ translateY: pan.y }],
        position: 'absolute',
        backgroundColor: 'blue',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        pointerEvents: 'auto',
        width: '100%',
      }}
      {...panResponder.panHandlers}
      onResponderStart={() => {
        debugger
      }}
    ></Animated.View>
  )
}
