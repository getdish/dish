import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import {
  GestureEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler'
import Animated, {
  WithDecayConfig,
  cancelAnimation,
  defineAnimation,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useVector } from 'react-native-redash'

import { useRefs } from '../useRefs'
import { Props, RenderItemInfo } from './types'

let lastDrag = Date.now()
export const getLastDrag = () => lastDrag

const snapPoint = (value: number, velocity: number, points: ReadonlyArray<number>): number => {
  'worklet'
  const point = value + 0.25 * velocity
  const deltas = points.map((p) => Math.abs(point - p))
  const minDelta = Math.min.apply(null, deltas)
  return points.filter((p) => Math.abs(point - p) === minDelta)[0]
}

const isAndroid = Platform.OS === 'android'

export const ResizableImage = React.memo(
  <T extends any>({
    item,
    translateX,
    index,
    isFirst,
    isLast,
    currentIndex,
    renderItem,
    width,
    height,
    onSwipeToClose,
    onTap,
    onDoubleTap,
    onPanStart,
    onScaleStart,
    emptySpaceWidth,
    doubleTapScale,
    doubleTapInterval,
    maxScale,
    pinchEnabled,
    disableTransitionOnScaledImage,
    hideAdjacentImagesOnScaledImage,
    disableVerticalSwipe,
    disableSwipeUp,
    disableTapToZoom,
    disablePinchToZoom,
    loop,
    length,
    onScaleChange,
    onScaleChangeRange,
    setRef,
  }: Props<T>) => {
    const CENTER = {
      x: width / 2,
      y: height / 2,
    }
    const { pinch, tap, doubleTap, pan } = useRefs()
    const pinchActive = useSharedValue(false)
    const panActive = useSharedValue(false)
    const offset = useVector(0, 0)
    const scale = useSharedValue(1)
    const translation = useVector(0, 0)
    const origin = useVector(0, 0)
    const adjustedFocal = useVector(0, 0)
    const originalLayout = useVector(width, 0)
    const layout = useVector(width, 0)
    const isActive = useDerivedValue(() => currentIndex.value === index)

    useAnimatedReaction(
      () => {
        return scale.value
      },
      (scaleReaction) => {
        if (!onScaleChange) {
          return
        }
        if (!onScaleChangeRange) {
          runOnJS(onScaleChange)(scaleReaction)
          return
        }
        if (scaleReaction > onScaleChangeRange.start && scaleReaction < onScaleChangeRange.end) {
          runOnJS(onScaleChange)(scaleReaction)
        }
      }
    )

    const setAdjustedFocal = ({ focalX, focalY }: Record<'focalX' | 'focalY', number>) => {
      'worklet'
      adjustedFocal.x.value = focalX - (CENTER.x + offset.x.value)
      adjustedFocal.y.value = focalY - (CENTER.y + offset.y.value)
    }

    const resetValues = (animated = true) => {
      'worklet'
      scale.value = animated ? withTiming(1) : 1
      offset.x.value = animated ? withTiming(0) : 0
      offset.y.value = animated ? withTiming(0) : 0
      translation.x.value = animated ? withTiming(0) : 0
      translation.y.value = animated ? withTiming(0) : 0
    }

    const getEdgeX = () => {
      'worklet'
      const newWidth = scale.value * layout.x.value
      const point = (newWidth - width) / 2
      if (point < 0) {
        return [-0, 0]
      }
      return [-point, point]
    }

    const clampY = (value: number, newScale: number) => {
      'worklet'
      const newHeight = newScale * layout.y.value
      const point = (newHeight - height) / 2
      if (newHeight < height) {
        return 0
      }
      return clamp(value, -point, point)
    }

    const clampX = (value: number, newScale: number) => {
      'worklet'
      const newWidth = newScale * layout.x.value
      const point = (newWidth - width) / 2
      if (newWidth < width) {
        return 0
      }
      return clamp(value, -point, point)
    }

    const getEdgeY = () => {
      'worklet'
      const newHeight = scale.value * layout.y.value
      const point = (newHeight - height) / 2
      return [-point, point]
    }

    const onStart = () => {
      'worklet'
      cancelAnimation(translateX)
      offset.x.value = offset.x.value + translation.x.value
      offset.y.value = offset.y.value + translation.y.value
      translation.x.value = 0
      translation.y.value = 0
    }

    const getPosition = (i?: number) => {
      'worklet'
      return -(width + emptySpaceWidth) * (typeof i !== 'undefined' ? i : index)
    }

    const getIndexFromPosition = (position: number) => {
      'worklet'
      return Math.round(position / -(width + emptySpaceWidth))
    }

    const gestureHandler = useAnimatedGestureHandler<
      GestureEvent<PinchGestureHandlerEventPayload>,
      {
        scaleOffset: number
        androidPinchActivated: boolean
      }
    >(
      {
        onStart: ({ focalX, focalY }, ctx) => {
          if (!pinchEnabled) return
          if (!isActive.value) return
          if (panActive.value && !isAndroid) return
          pinchActive.value = true
          if (onScaleStart) {
            runOnJS(onScaleStart)()
          }
          if (isAndroid) {
            ctx.androidPinchActivated = false
          }
          onStart()
          ctx.scaleOffset = scale.value
          setAdjustedFocal({ focalX, focalY })
          origin.x.value = adjustedFocal.x.value
          origin.y.value = adjustedFocal.y.value
        },
        onActive: ({ scale: s, focalX, focalY, numberOfPointers }, ctx) => {
          if (!pinchEnabled) return
          if (!isActive.value) return
          if (numberOfPointers !== 2 && !isAndroid) return
          if (panActive.value && !isAndroid) return
          if (!ctx.androidPinchActivated && isAndroid) {
            setAdjustedFocal({ focalX, focalY })
            origin.x.value = adjustedFocal.x.value
            origin.y.value = adjustedFocal.y.value
            ctx.androidPinchActivated = true
          }

          const nextScale = withRubberBandClamp(s * ctx.scaleOffset, 0.55, maxScale, [1, maxScale])
          scale.value = nextScale
          setAdjustedFocal({ focalX, focalY })
          translation.x.value =
            adjustedFocal.x.value + ((-1 * nextScale) / ctx.scaleOffset) * origin.x.value
          translation.y.value =
            adjustedFocal.y.value + ((-1 * nextScale) / ctx.scaleOffset) * origin.y.value
        },
        onFinish: (_, ctx) => {
          if (!pinchEnabled) return
          if (!isActive.value) return

          pinchActive.value = false

          if (scale.value < 1) {
            resetValues()
          } else {
            const sc = Math.min(scale.value, maxScale)
            const newWidth = sc * layout.x.value
            const newHeight = sc * layout.y.value
            const nextTransX =
              scale.value > maxScale
                ? adjustedFocal.x.value + ((-1 * maxScale) / ctx.scaleOffset) * origin.x.value
                : translation.x.value
            const nextTransY =
              scale.value > maxScale
                ? adjustedFocal.y.value + ((-1 * maxScale) / ctx.scaleOffset) * origin.y.value
                : translation.y.value
            const diffX = nextTransX + offset.x.value - (newWidth - width) / 2
            if (scale.value > maxScale) {
              scale.value = withTiming(maxScale)
            }

            if (newWidth <= width) {
              translation.x.value = withTiming(0)
            } else {
              let moved
              if (diffX > 0) {
                translation.x.value = withTiming(nextTransX - diffX)
                moved = true
              }
              if (newWidth + diffX < width) {
                translation.x.value = withTiming(nextTransX + width - (newWidth + diffX))
                moved = true
              }
              if (!moved) {
                translation.x.value = withTiming(nextTransX)
              }
            }

            const diffY = nextTransY + offset.y.value - (newHeight - height) / 2

            if (newHeight <= height) {
              translation.y.value = withTiming(-offset.y.value)
            } else {
              let moved
              if (diffY > 0) {
                translation.y.value = withTiming(nextTransY - diffY)
                moved = true
              }
              if (newHeight + diffY < height) {
                translation.y.value = withTiming(nextTransY + height - (newHeight + diffY))
                moved = true
              }
              if (!moved) {
                translation.y.value = withTiming(nextTransY)
              }
            }
          }
        },
      },
      [layout.x, layout.y, index, isFirst, isLast, width, height]
    )

    const singleTapHandler = useAnimatedGestureHandler<GestureEvent<TapGestureHandlerEventPayload>>(
      {
        onActive: () => {
          if (onTap) {
            runOnJS(onTap)()
          }
        },
      }
    )

    const doubleTapHandler = useAnimatedGestureHandler<GestureEvent<TapGestureHandlerEventPayload>>(
      {
        onActive: ({ x, y, numberOfPointers }) => {
          if (!isActive.value) return
          if (numberOfPointers !== 1) return
          if (onDoubleTap) {
            runOnJS(onDoubleTap)()
          }
          if (scale.value === 1) {
            scale.value = withTiming(doubleTapScale)
            setAdjustedFocal({ focalX: x, focalY: y })
            offset.x.value = withTiming(
              clampX(
                adjustedFocal.x.value + -1 * doubleTapScale * adjustedFocal.x.value,
                doubleTapScale
              )
            )
            offset.y.value = withTiming(
              clampY(
                adjustedFocal.y.value + -1 * doubleTapScale * adjustedFocal.y.value,
                doubleTapScale
              )
            )
          } else {
            resetValues()
          }
        },
      }
    )

    const panHandler = useAnimatedGestureHandler<
      GestureEvent<PanGestureHandlerEventPayload>,
      {
        scaleOffset: number
        initialTranslateX: number
        isVertical: boolean
        shouldClose: boolean
      }
    >(
      {
        onStart: ({ velocityY, velocityX }, ctx) => {
          if (!isActive.value) return
          if (pinchActive.value && !isAndroid) return
          panActive.value = true
          if (onPanStart) {
            runOnJS(onPanStart)()
          }
          onStart()
          ctx.isVertical = Math.abs(velocityY) > Math.abs(velocityX)
          ctx.initialTranslateX = translateX.value
        },
        onActive: ({ translationX, translationY, velocityY }, ctx) => {
          if (!isActive.value) return
          if (pinchActive.value && !isAndroid) return
          if (disableVerticalSwipe && scale.value === 1 && ctx.isVertical) return
          lastDrag = Date.now()

          const x = getEdgeX()

          if (!ctx.isVertical || scale.value > 1) {
            const clampedX = clamp(translationX, x[0] - offset.x.value, x[1] - offset.x.value)
            if (hideAdjacentImagesOnScaledImage && disableTransitionOnScaledImage) {
              const disabledTransition = disableTransitionOnScaledImage && scale.value > 1
              const moveX = withRubberBandClamp(
                ctx.initialTranslateX + translationX - clampedX,
                0.55,
                width,
                disabledTransition
                  ? [getPosition(index), getPosition(index + 1)]
                  : [getPosition(length - 1), 0]
              )
              if (!disabledTransition) {
                translateX.value = moveX
              }
              if (disabledTransition) {
                translation.x.value = clampedX + moveX - translateX.value
              } else {
                translation.x.value = clampedX
              }
            } else {
              if (loop) {
                translateX.value = ctx.initialTranslateX + translationX - clampedX
              } else {
                translateX.value = withRubberBandClamp(
                  ctx.initialTranslateX + translationX - clampedX,
                  0.55,
                  width,
                  disableTransitionOnScaledImage && scale.value > 1
                    ? [getPosition(index), getPosition(index + 1)]
                    : [getPosition(length - 1), 0]
                )
              }
              translation.x.value = clampedX
            }
          }

          const newHeight = scale.value * layout.y.value
          const edgeY = getEdgeY()
          if (newHeight > height) {
            translation.y.value = withRubberBandClamp(translationY, 0.55, newHeight, [
              edgeY[0] - offset.y.value,
              edgeY[1] - offset.y.value,
            ])
          } else if (
            !(scale.value === 1 && translateX.value !== getPosition()) &&
            (!disableSwipeUp || translationY >= 0)
          ) {
            translation.y.value = translationY
          }

          if (ctx.isVertical && newHeight <= height) {
            const destY = translationY + velocityY * 0.2
            ctx.shouldClose = disableSwipeUp ? destY > 220 : Math.abs(destY) > 220
          }
        },
        onFinish: ({ velocityX, velocityY }, ctx) => {
          lastDrag = Date.now()
          if (!isActive.value) return
          panActive.value = false
          const newHeight = scale.value * layout.y.value
          const edgeX = getEdgeX()

          if (
            Math.abs(translateX.value - getPosition()) >= 0 &&
            edgeX.some((x) => x === translation.x.value + offset.x.value)
          ) {
            let snapPoints = [index - 1, index, index + 1]
              .filter((_, y) => {
                if (loop) return true
                if (y === 0) {
                  return !isFirst
                }
                if (y === 2) {
                  return !isLast
                }
                return true
              })
              .map((i) => getPosition(i))

            if (disableTransitionOnScaledImage && scale.value > 1) {
              snapPoints = [getPosition(index)]
            }

            let snapTo = snapPoint(translateX.value, velocityX, snapPoints)
            const nextIndex = getIndexFromPosition(snapTo)
            if (currentIndex.value !== nextIndex) {
              if (loop) {
                if (nextIndex === length) {
                  currentIndex.value = 0
                  translateX.value = translateX.value - getPosition(length)
                  snapTo = 0
                } else if (nextIndex === -1) {
                  currentIndex.value = length - 1
                  translateX.value = translateX.value + getPosition(length)
                  snapTo = getPosition(length - 1)
                } else {
                  currentIndex.value = nextIndex
                }
              } else {
                currentIndex.value = nextIndex
              }
            }

            translateX.value = withSpring(snapTo, {
              damping: 800,
              mass: 1,
              stiffness: 250,
              restDisplacementThreshold: 0.02,
              restSpeedThreshold: 4,
            })
          } else {
            const newWidth = scale.value * layout.x.value
            offset.x.value = withDecaySpring({
              velocity: velocityX,
              clamp: [
                -(newWidth - width) / 2 - translation.x.value,
                (newWidth - width) / 2 - translation.x.value,
              ],
            })
          }

          if (onSwipeToClose && ctx.shouldClose) {
            offset.y.value = withDecay({
              velocity: velocityY,
            })
            runOnJS(onSwipeToClose)()
            return
          }

          if (newHeight > height) {
            offset.y.value = withDecaySpring({
              velocity: velocityY,
              clamp: [
                -(newHeight - height) / 2 - translation.y.value,
                (newHeight - height) / 2 - translation.y.value,
              ],
            })
          } else {
            const diffY = translation.y.value + offset.y.value - (newHeight - height) / 2
            if (newHeight <= height && diffY !== height - diffY - newHeight) {
              const moveTo = diffY - (height - newHeight) / 2
              translation.y.value = withTiming(translation.y.value - moveTo)
            }
          }
        },
      },
      [layout.x, layout.y, index, isFirst, isLast, loop, width, height]
    )

    useAnimatedReaction(
      () => {
        return {
          i: currentIndex.value,
          translateX: translateX.value,
          currentScale: scale.value,
        }
      },
      ({ i, translateX, currentScale }) => {
        const translateIndex = translateX / -(width + emptySpaceWidth)
        if (loop) {
          let diff = Math.abs((translateIndex % 1) - 0.5)
          if (diff > 0.5) {
            diff = 1 - diff
          }
          if (diff > 0.48 && Math.abs(i) !== index) {
            resetValues(false)
            return
          }
        }
        if (Math.abs(i - index) === 2 && currentScale > 1) {
          resetValues(false)
        }
      }
    )

    useEffect(() => {
      setRef(index, {
        reset: (animated: boolean) => resetValues(animated),
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index])

    const animatedStyle = useAnimatedStyle(() => {
      const isNextForLast =
        loop &&
        isFirst &&
        currentIndex.value === length - 1 &&
        translateX.value < getPosition(length - 1)
      const isPrevForFirst =
        loop && isLast && currentIndex.value === 0 && translateX.value > getPosition(0)
      return {
        transform: [
          {
            translateX:
              offset.x.value +
              translation.x.value -
              (isNextForLast ? getPosition(length) : 0) +
              (isPrevForFirst ? getPosition(length) : 0),
          },
          { translateY: offset.y.value + translation.y.value },
          { scale: scale.value },
        ],
      }
    })

    const onLayout: RenderItemInfo<T>['onLayout'] = (e) => {
      const { width: w, height: h } = e.nativeEvent.layout
      originalLayout.x.value = w
      originalLayout.y.value = h
      const portrait = width > height
      if (portrait) {
        const imageHeight = Math.min((h * width) / w, height)
        const imageWidth = Math.min(w, width)
        layout.y.value = imageHeight
        if (imageHeight === height) {
          layout.x.value = (w * height) / h
        } else {
          layout.x.value = imageWidth
        }
      } else {
        const imageWidth = Math.min((w * height) / h, width)
        const imageHeight = Math.min(h, height)
        layout.x.value = imageWidth
        if (imageWidth === width) {
          layout.y.value = (h * width) / w
        } else {
          layout.y.value = imageHeight
        }
      }
    }

    useEffect(() => {
      onLayout({
        nativeEvent: {
          layout: {
            width: originalLayout.x.value,
            height: originalLayout.y.value,
          },
        },
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, height])

    const itemProps: RenderItemInfo<T> = {
      item,
      index,
      onLayout,
    }

    return (
      <PanGestureHandler
        ref={pan}
        onGestureEvent={panHandler}
        minDist={10}
        minPointers={1}
        maxPointers={1}
      >
        <Animated.View style={[{ width, height }]}>
          <PinchGestureHandler
            ref={pinch}
            enabled={!disablePinchToZoom}
            simultaneousHandlers={[pan]}
            onGestureEvent={gestureHandler}
            minPointers={2}
          >
            <Animated.View style={{ width, height }}>
              <TapGestureHandler
                ref={doubleTap}
                onGestureEvent={singleTapHandler}
                waitFor={tap}
                maxDeltaX={10}
                maxDeltaY={10}
              >
                <Animated.View style={[{ width, height }, animatedStyle]}>
                  <TapGestureHandler
                    enabled={!disableTapToZoom}
                    ref={tap}
                    onGestureEvent={doubleTapHandler}
                    numberOfTaps={2}
                    maxDelayMs={doubleTapInterval}
                  >
                    <Animated.View style={{ width, height }}>{renderItem(itemProps)}</Animated.View>
                  </TapGestureHandler>
                </Animated.View>
              </TapGestureHandler>
            </Animated.View>
          </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    )
  }
)

export const clamp = (value: number, min: number, max: number) => {
  'worklet'

  return Math.max(Math.min(value, max), min)
}

export const rubberBandClamp = (x: number, coeff: number, dim: number) => {
  'worklet'

  return (1.0 - 1.0 / ((x * coeff) / dim + 1.0)) * dim
}

export const withRubberBandClamp = (
  x: number,
  coeff: number,
  dim: number,
  limits: [number, number]
) => {
  'worklet'
  let clampedX = clamp(x, limits[0], limits[1])
  let diff = Math.abs(x - clampedX)
  let sign = clampedX > x ? -1 : 1
  return clampedX + sign * rubberBandClamp(diff, coeff, dim)
}

export function withDecaySpring(userConfig: WithDecayConfig & { clamp: [number, number] }) {
  'worklet'

  return defineAnimation(0, () => {
    'worklet'
    const config = {
      deceleration: 0.997,
      // SPRING CONFIG
      damping: 800,
      mass: 1,
      stiffness: 150,

      overshootClamping: false,
      restDisplacementThreshold: 0.02,
      restSpeedThreshold: 4,
      clamp: userConfig.clamp,
      velocity: userConfig.velocity,
    }

    const VELOCITY_EPS = 1

    function decaySpring(animation: any, now: number) {
      const { lastTimestamp, current, velocity } = animation

      const deltaTime = Math.min(now - lastTimestamp, 64)
      animation.lastTimestamp = now

      const kv = Math.pow(config.deceleration, deltaTime)
      const kx = (config.deceleration * (1 - kv)) / (1 - config.deceleration)

      const v0 = velocity / 1000
      let v = v0 * kv * 1000
      const nextX = current + v0 * kx

      let x = nextX

      if (Array.isArray(config.clamp)) {
        if (animation.moveBack) {
          const toValue = animation.toValue

          const c = config.damping
          const m = config.mass
          const k = config.stiffness

          const springV0 = -velocity
          const x0 = toValue - current

          const zeta = c / (2 * Math.sqrt(k * m)) // damping ratio
          const omega0 = Math.sqrt(k / m) // undamped angular frequency of the oscillator (rad/ms)
          const omega1 = omega0 * Math.sqrt(1 - zeta ** 2) // exponential decay

          const t = deltaTime / 1000

          const sin1 = Math.sin(omega1 * t)
          const cos1 = Math.cos(omega1 * t)

          // under damped
          const underDampedEnvelope = Math.exp(-zeta * omega0 * t)
          const underDampedFrag1 =
            underDampedEnvelope * (sin1 * ((springV0 + zeta * omega0 * x0) / omega1) + x0 * cos1)

          const underDampedPosition = toValue - underDampedFrag1
          // This looks crazy -- it's actually just the derivative of the oscillation function
          const underDampedVelocity =
            zeta * omega0 * underDampedFrag1 -
            underDampedEnvelope * (cos1 * (springV0 + zeta * omega0 * x0) - omega1 * x0 * sin1)

          // critically damped
          const criticallyDampedEnvelope = Math.exp(-omega0 * t)
          const criticallyDampedPosition =
            toValue - criticallyDampedEnvelope * (x0 + (springV0 + omega0 * x0) * t)

          const criticallyDampedVelocity =
            criticallyDampedEnvelope * (springV0 * (t * omega0 - 1) + t * x0 * omega0 * omega0)

          const isOvershooting = () => {
            if (config.overshootClamping && config.stiffness !== 0) {
              return current < toValue ? animation.current > toValue : animation.current < toValue
            } else {
              return false
            }
          }

          const isVelocity = Math.abs(velocity) < config.restSpeedThreshold
          const isDisplacement =
            config.stiffness === 0 || Math.abs(toValue - current) < config.restDisplacementThreshold

          if (zeta < 1) {
            x = underDampedPosition
            v = underDampedVelocity
          } else {
            x = criticallyDampedPosition
            v = criticallyDampedVelocity
          }

          if (isOvershooting() || (isVelocity && isDisplacement)) {
            return true
          }
        }

        if (nextX < config.clamp[0] || nextX > config.clamp[1]) {
          if (!animation.startTime) {
            animation.startTime = now
            animation.progress = 0
            animation.moveBack = true

            animation.toValue = nextX <= config.clamp[0] ? config.clamp[0] : config.clamp[1]
          }
        }
      }

      animation.current = x
      animation.velocity = v

      return Math.abs(v) < VELOCITY_EPS && !(nextX < config.clamp[0] || nextX > config.clamp[1])
    }

    function onStart(animation: any, value: number, now: number) {
      animation.current = value
      animation.lastTimestamp = now
      animation.initialVelocity = config.velocity
    }

    return {
      onFrame: decaySpring,
      onStart,
      velocity: config.velocity || 0,
    }
  })
}
