import { StackProps, VStack } from '@dish/ui'
import React, { useEffect, useMemo, useState } from 'react'
import {
  Animated,
  PerpectiveTransform,
  RotateTransform,
  RotateXTransform,
  RotateYTransform,
  RotateZTransform,
  ScaleTransform,
  ScaleXTransform,
  ScaleYTransform,
  SkewXTransform,
  SkewYTransform,
  TranslateXTransform,
  TranslateYTransform,
} from 'react-native'

const defaultAnimation = {
  from: {
    opacity: 0,
    translateY: 100,
  },
  to: {
    opacity: 1,
    translateY: 0,
  },
}

type AnimatableProps = Partial<
  Pick<StackProps, 'backgroundColor' | 'borderColor' | 'opacity'> &
    PerpectiveTransform &
    RotateTransform &
    RotateXTransform &
    RotateYTransform &
    RotateZTransform &
    ScaleTransform &
    ScaleXTransform &
    ScaleYTransform &
    TranslateXTransform &
    TranslateYTransform &
    SkewXTransform &
    SkewYTransform
>
const styleKeys = {
  opacity: true,
  backgroundColor: true,
  borderColor: true,
}

export const AnimatedVStack = ({
  animation = defaultAnimation,
  velocity,
  children,
  ...props
}: StackProps & {
  velocity?: number
  animation?: {
    from: AnimatableProps
    to: AnimatableProps
  }
}) => {
  const [state, setState] = useState({
    props: null,
    start: null,
  })

  useEffect(() => {
    if (state.start) {
      state.start()
      return
    }

    const styleProps = {}
    const transform: any[] = []
    const driver = new Animated.Value(0)

    for (const key in animation.from) {
      const fromVal = animation.from[key]
      const toVal = animation.to[key]
      const interpolatedVal = driver.interpolate({
        inputRange: [0, 1],
        outputRange: [fromVal, toVal],
      })
      if (styleKeys[key]) {
        styleProps[key] = interpolatedVal
      } else {
        transform.push({
          [key]: interpolatedVal,
        })
      }
    }

    setState({
      props: { transform, ...styleProps },
      start: () => {
        Animated.spring(driver, {
          useNativeDriver: true,
          velocity,
          toValue: 1,
        }).start()
      },
    })
  }, [state])

  const childrenMemo = useMemo(() => children, [children])

  return (
    <VStack animated {...props} {...state.props}>
      {childrenMemo}
    </VStack>
  )
}
