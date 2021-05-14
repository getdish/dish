import { useEffect, useRef, useState } from 'react'
import { Animated, PanResponder, StyleSheet } from 'react-native'

import { StackDrawer as StackDrawerContents, StackDrawerProps } from './StackDrawer'

export function StackDrawer(props: StackDrawerProps) {
  const x = 0
  const [pan] = useState(() => new Animated.Value(x))

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset(pan['_value'])
      },
      onPanResponderMove: Animated.event([null, { dx: pan }]),
      onPanResponderRelease: () => {
        pan.flattenOffset()
      },
    })
  ).current

  console.log('ok')

  // useEffect(() => {
  //   Animated.spring(translateY, {
  //     useNativeDriver: true,
  //     toValue: x,
  //   }).start()
  // }, [x])

  return (
    <>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX: pan }],
          },
        ]}
      >
        <StackDrawerContents {...props} />
      </Animated.View>
    </>
  )
}
