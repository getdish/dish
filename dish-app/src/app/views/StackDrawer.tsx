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
import { PageTitleTag } from './PageTitleTag'
import { StackCloseButton } from './StackCloseButton'

export type StackDrawerProps = StackProps & {
  title?: string
  closable?: boolean
  fallback?: any
  topLeftControls?: any
}

// export function StackDrawer(props: StackDrawerProps) {
//   const [data, _panResponder, animation, scale, opacity] = useTinderCards([
//     {
//       image: require('../../assets/dish-neon.jpg'),
//       id: 1,
//       name: 'Bobo',
//       animal: 'Cat',
//     },
//     {
//       image: require('../../assets/dish-neon.jpg'),
//       id: 2,
//       name: 'Dolly',
//       animal: 'Dog',
//     },
//     {
//       image: require('../../assets/dish-neon.jpg'),
//       id: 3,
//       name: 'Milo',
//       animal: 'Giraffe',
//     },
//     {
//       image: require('../../assets/dish-neon.jpg'),
//       id: 4,
//       name: 'Ollie',
//       animal: 'Goat',
//     },
//   ])

//   return (
//     <View style={styles.container}>
//       {data
//         .slice(0, 2)
//         .reverse()
//         .map((item, index, items) => {
//           const isLastItem = index === items.length - 1
//           const panHandlers = isLastItem ? { ..._panResponder.panHandlers } : {}
//           const isSecondToLast = index === items.length - 2
//           const rotate = animation.x.interpolate({
//             inputRange: [-200, 0, 200],
//             outputRange: ['-30deg', '0deg', '30deg'],
//             extrapolate: 'clamp',
//           })

//           const animatedCardStyles = {
//             transform: [{ rotate }, ...animation.getTranslateTransform()],
//             opacity,
//           }

//           const cardStyle = isLastItem ? animatedCardStyles : undefined
//           const nextStyle = isSecondToLast
//             ? { transform: [{ scale: scale }], borderRadius: 5 }
//             : undefined

//           return (
//             <Animated.View
//               {...panHandlers}
//               style={[styles.card, cardStyle, nextStyle]}
//               key={item.id}
//             >
//               <View style={styles.imageContainer}>
//                 <Image resizeMode="cover" source={item.image} style={styles.image} />
//               </View>
//               <View style={styles.textContainer}>
//                 <Text style={styles.nameText}>{item.name}</Text>
//                 <Text style={styles.animalText}>{item.animal}</Text>
//               </View>
//             </Animated.View>
//           )
//         })}
//     </View>
//   )
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  card: {
    width: '100%',
    height: 300,
    backgroundColor: '#f4f4f4',
    position: 'absolute',
    borderRadius: 10,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      },
      web: {
        boxShadow: '0 3px 5px rgba(0,0,0,0.10), 1px 2px 5px rgba(0,0,0,0.10)',
      },
    }),
    borderWidth: 1,
    borderColor: '#FFF',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    padding: 10,
  },
  nameText: {
    fontSize: 16,
  },
  animalText: {
    fontSize: 14,
    color: '#757575',
    paddingTop: 5,
  },
})

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
      {!!title && <PageTitleTag>{title}</PageTitleTag>}
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

export default function useTinderCards(deck) {
  const [data, setData] = useState(deck)

  const animation = useRef(new Animated.ValueXY()).current
  const opacity = useRef(new Animated.Value(1)).current
  const scale = useRef(new Animated.Value(0.9)).current

  const transitionNext = function () {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setData((data) => {
        return data.slice(1)
      })
    })
  }

  useEffect(() => {
    scale.setValue(0.9)
    opacity.setValue(1)
    animation.setValue({ x: 0, y: 0 })
  }, [data])

  const _panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        animation.setValue({ x: gesture.dx, y: gesture.dy })
      },
      onPanResponderRelease: (e, { dx, dy, vx, vy }) => {
        let velocity
        if (vx >= 0) {
          velocity = clamp(vx, 4, 5)
        } else if (vx < 0) {
          velocity = clamp(Math.abs(vx), 4, 5) * -1
        }
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          Animated.parallel([
            Animated.decay(animation, {
              velocity: { x: velocity, y: vy },
              deceleration: 0.99,
              useNativeDriver: false,
            }),
            Animated.spring(scale, {
              toValue: 1,
              friction: 4,
              useNativeDriver: false,
            }),
          ]).start(transitionNext)
          if (velocity > 0) {
            // handleRightDecay();
          } else {
            // handleLeftDecay();
          }
        } else {
          Animated.spring(animation, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start()
        }
      },
    })
  ).current
  return [data, _panResponder, animation, scale, opacity]
}
