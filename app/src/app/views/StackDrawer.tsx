import { series, sleep } from '@dish/async'
import { clamp } from 'lodash'
import { default as React, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { AbsoluteVStack, LoadingItems, StackProps, VStack, useMedia, useTheme } from 'snackui'

import { drawerBorderRadius, drawerWidthMax } from '../../constants/constants'
import { STACK_ANIMATION_DURATION } from '../home/HomeStackView'
import { HomeSuspense } from '../home/HomeSuspense'
import { PageHead } from './PageHead'
import { StackCloseButton } from './StackCloseButton'

export type StackDrawerProps = StackProps & {
  title?: string
  closable?: boolean
  fallback?: any
  topLeftControls?: any
}

export const StackDrawer = ({
  title,
  closable,
  children,
  fallback,
  topLeftControls,
  ...props
}: StackDrawerProps) => {
  const media = useMedia()
  const theme = useTheme()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    return series([
      // dont show right away to get animation
      () => sleep(STACK_ANIMATION_DURATION),
      () => setIsLoaded(true),
    ])
  }, [])

  return (
    <>
      {!!title && <PageHead>{title}</PageHead>}
      <AbsoluteVStack
        position="absolute"
        left={media.sm ? 0 : 'auto'}
        right={media.sm ? 0 : 0}
        flex={1}
        maxHeight="100%"
        height="100%"
        minHeight="100%"
        width="100%"
        borderRadius={drawerBorderRadius}
        maxWidth={media.sm ? '100%' : drawerWidthMax}
        minWidth={media.sm ? '100%' : 200}
        justifyContent="flex-end"
        shadowRadius={9}
        shadowColor={theme.shadowColor}
      >
        {!!topLeftControls && (
          <AbsoluteVStack
            className="top-left-controls"
            zIndex={1000000000000}
            left={media.sm ? 6 : 12}
            top={media.sm ? 6 : 72}
          >
            {topLeftControls}
          </AbsoluteVStack>
        )}
        {closable && <StackCloseButton />}
        <VStack
          // keep this nested, fix-overflow hides box-shadow otherwise
          className="safari-fix-overflow"
          position="relative"
          flex={1}
          flexShrink={1}
          borderRadius={drawerBorderRadius}
          maxWidth={media.sm ? '100%' : drawerWidthMax}
          backgroundColor={theme.backgroundColor}
          overflow="hidden"
          {...props}
        >
          <HomeSuspense fallback={fallback ?? <LoadingItems />}>
            {isLoaded ? children : null}
          </HomeSuspense>
        </VStack>
      </AbsoluteVStack>
    </>
  )
}
const { width } = Dimensions.get('screen')

const SWIPE_THRESHOLD = 0.25 * width

// function useTinderCards(deck) {
//   const [data, setData] = useState(deck)

//   const animation = useRef(new Animated.ValueXY()).current
//   const opacity = useRef(new Animated.Value(1)).current
//   const scale = useRef(new Animated.Value(0.9)).current

//   const transitionNext = function () {
//     Animated.parallel([
//       Animated.timing(opacity, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: false,
//       }),
//       Animated.spring(scale, {
//         toValue: 1,
//         friction: 4,
//         useNativeDriver: false,
//       }),
//     ]).start(() => {
//       setData((data) => {
//         return data.slice(1)
//       })
//     })
//   }

//   useEffect(() => {
//     scale.setValue(0.9)
//     opacity.setValue(1)
//     animation.setValue({ x: 0, y: 0 })
//   }, [data])

//   const _panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderMove: (event, gesture) => {
//         animation.setValue({ x: gesture.dx, y: gesture.dy })
//       },
//       onPanResponderRelease: (e, { dx, dy, vx, vy }) => {
//         let velocity
//         if (vx >= 0) {
//           velocity = clamp(vx, 4, 5)
//         } else if (vx < 0) {
//           velocity = clamp(Math.abs(vx), 4, 5) * -1
//         }
//         if (Math.abs(dx) > SWIPE_THRESHOLD) {
//           Animated.parallel([
//             Animated.decay(animation, {
//               velocity: { x: velocity, y: vy },
//               deceleration: 0.99,
//               useNativeDriver: false,
//             }),
//             Animated.spring(scale, {
//               toValue: 1,
//               friction: 4,
//               useNativeDriver: false,
//             }),
//           ]).start(transitionNext)
//           if (velocity > 0) {
//             // handleRightDecay();
//           } else {
//             // handleLeftDecay();
//           }
//         } else {
//           Animated.spring(animation, {
//             toValue: { x: 0, y: 0 },
//             friction: 4,
//             useNativeDriver: false,
//           }).start()
//         }
//       },
//     })
//   ).current
//   return [data, _panResponder, animation, scale, opacity]
// }
