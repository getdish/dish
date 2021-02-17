import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import {
  StackDrawer as StackDrawerContents,
  StackDrawerProps,
} from './StackDrawerContents'

export function StackDrawer(props: StackDrawerProps) {
  const x = useSharedValue(0)

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      // @ts-expect-error
      ctx.startX = x.value
    },
    onActive: (event, ctx) => {
      // @ts-expect-error
      x.value = ctx.startX + event.translationX
    },
    onEnd: (_) => {
      x.value = withSpring(0)
    },
  })

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    }
  })

  return (
    <>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={{
            position: 'absolute',
            width: 40,
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 1000,
            // backgroundColor: 'red',
          }}
        />
      </PanGestureHandler>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <StackDrawerContents {...props} />
      </Animated.View>
    </>
  )
}
