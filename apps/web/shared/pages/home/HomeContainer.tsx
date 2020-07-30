import { AbsoluteVStack, HStack, LinearGradient, VStack } from '@dish/ui'
import React, { useMemo, useRef } from 'react'
import { Animated, PanResponder, StyleSheet, View } from 'react-native'

import { bgAlt, bgLightTranslucent } from '../../colors'
import { drawerPad, pageWidthMax, searchBarHeight } from '../../constants'
import { useOvermind } from '../../state/useOvermind'
import { HomeSearchBarDrawer } from './HomeSearchBar'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

const snapPoints = [0.05, 0.25, 0.6]
let snapIndex = 1
const getSnapPoint = (px?: number) => {
  if (px) {
    for (const [index, point] of snapPoints.entries()) {
      const cur = point * window.innerHeight
      const next = (snapPoints[index + 1] ?? 1) * window.innerHeight
      const midWayToNext = cur + (next - cur) / 2
      if (px < midWayToNext) {
        snapIndex = index
        break
      }
    }
  }
  return snapPoints[snapIndex] * window.innerHeight
}

const pan = new Animated.Value(getSnapPoint())
let spring: any
const panResponder = PanResponder.create({
  onMoveShouldSetPanResponder: () => true,
  onPanResponderGrant: () => {
    // document.body.classList.add('unselectable-all')
    spring?.stop()
    spring = null
    pan.setOffset(pan['_value'])
  },
  onPanResponderMove: Animated.event([null, { dy: pan }]),
  onPanResponderRelease: () => {
    pan.flattenOffset()
    spring = Animated.spring(pan, {
      useNativeDriver: true,
      toValue: getSnapPoint(pan['_value']),
    })
    spring.start(() => {
      spring = null
    })
    // document.body.classList.remove('unselectable-all')
  },
})

const DraggableDrawer = (props: { children: any }) => {
  const children = useMemo(() => props.children, [props.children])

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: pan,
          },
        ],
        maxWidth: pageWidthMax,
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* handle */}
      <View
        style={{
          position: 'absolute',
          top: -30,
          padding: 15,
        }}
        {...panResponder.panHandlers}
      >
        <VStack
          backgroundColor="rgba(100,100,100,0.5)"
          width={60}
          height={8}
          borderRadius={100}
        />
      </View>

      <VStack
        width="100%"
        height="100%"
        backgroundColor="#fff"
        shadowColor="rgba(0,0,0,0.13)"
        shadowRadius={44}
        shadowOffset={{ width: 10, height: 0 }}
        borderTopRightRadius={10}
        borderTopLeftRadius={10}
      >
        <View {...panResponder.panHandlers}>
          <HomeSearchBarDrawer />
        </View>
        {children}
      </VStack>
    </Animated.View>
  )
}

export function HomeContainer(props: { children: any }) {
  const om = useOvermind()
  const isSmall = useMediaQueryIsSmall()
  const drawerWidth = useHomeDrawerWidth(Infinity)
  const children = useMemo(() => props.children, [props.children])

  if (isSmall) {
    return <DraggableDrawer>{children}</DraggableDrawer>
  }

  return (
    <VStack
      fullscreen
      // TODO ui-static this fails if i remove conditional above!
      width={drawerWidth + drawerPad}
      flex={1}
      position="absolute"
      top={0}
      pointerEvents="none"
      alignItems="flex-end"
    >
      <HStack
        pointerEvents="auto"
        position="absolute"
        top={0}
        bottom={0}
        zIndex={10}
        width="100%"
        flex={1}
        backgroundColor="#fff"
        shadowColor="rgba(0,0,0,0.13)"
        shadowRadius={44}
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

        {/* cross line */}
        <AbsoluteVStack fullscreen pointerEvents="none" overflow="hidden">
          <AbsoluteVStack
            height={400}
            width={2000}
            right="-10%"
            top="-20%"
            backgroundColor={bgLightTranslucent}
            transform={[{ rotate: '-4deg' }]}
          />
        </AbsoluteVStack>

        <VStack
          flex={1}
          maxWidth="100%"
          marginLeft={'auto'}
          position="relative"
        >
          {props.children}
        </VStack>
      </HStack>
    </VStack>
  )
}
