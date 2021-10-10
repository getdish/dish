import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import { Image } from '../app/views/Image'
import { isNative } from '../constants/constants'
import { ResizableImage } from './ResizableImage'
import { EventsCallbacks, ItemRef, RenderItem, RenderItemInfo } from './types'

const DOUBLE_TAP_SCALE = 3
const MAX_SCALE = 6
const SPACE_BETWEEN_IMAGES = 40
const defaultRenderImage = ({ item, onLayout }: RenderItemInfo<any>) => {
  return (
    <Image
      onLayout={onLayout}
      source={{ uri: item }}
      resizeMode="contain"
      style={StyleSheet.absoluteFillObject}
    />
  )
}

export type GalleryRef = {
  setIndex: (newIndex: number) => void
  reset: (animated?: boolean) => void
}

type GalleryReactRef = React.Ref<GalleryRef>

type GalleryProps<T> = EventsCallbacks & {
  ref?: GalleryReactRef
  data: T[]
  renderItem?: RenderItem<T>
  keyExtractor?: (item: T, index: number) => string | number
  initialIndex?: number
  onIndexChange?: (index: number) => void
  numToRender?: number
  emptySpaceWidth?: number
  doubleTapScale?: number
  doubleTapInterval?: number
  maxScale?: number
  style?: ViewStyle
  containerDimensions?: { width: number; height: number }
  pinchEnabled?: boolean
  disableTapToZoom?: boolean
  disablePinchToZoom?: boolean
  disableTransitionOnScaledImage?: boolean
  hideAdjacentImagesOnScaledImage?: boolean
  disableVerticalSwipe?: boolean
  disableSwipeUp?: boolean
  loop?: boolean
  onScaleChange?: (scale: number) => void
  onScaleChangeRange?: { start: number; end: number }
}

const GalleryComponent = <T extends any>(
  {
    data,
    renderItem = defaultRenderImage,
    initialIndex = 0,
    numToRender = 5,
    emptySpaceWidth = SPACE_BETWEEN_IMAGES,
    doubleTapScale = DOUBLE_TAP_SCALE,
    doubleTapInterval = 500,
    maxScale = MAX_SCALE,
    pinchEnabled = true,
    disableTransitionOnScaledImage = false,
    hideAdjacentImagesOnScaledImage = false,
    onIndexChange,
    style,
    keyExtractor,
    containerDimensions,
    disableVerticalSwipe,
    disableSwipeUp = false,
    loop = false,
    onScaleChange,
    onScaleChangeRange,
    ...eventsCallbacks
  }: GalleryProps<T>,
  ref: GalleryReactRef
) => {
  if (isNative) {
    return null
  }

  const windowDimensions = useWindowDimensions()
  const dimensions = containerDimensions || windowDimensions
  const isLoop = loop && data?.length > 1
  const [index, setIndex] = useState(initialIndex)
  const refs = useRef<ItemRef[]>([])
  const setRef = useCallback((index: number, value: ItemRef) => {
    refs.current[index] = value
  }, [])
  const translateX = useSharedValue(initialIndex * -(dimensions.width + emptySpaceWidth))
  const currentIndex = useSharedValue(initialIndex)
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))
  const changeIndex = useCallback(
    (newIndex) => {
      onIndexChange?.(newIndex)
      setIndex(newIndex)
    },
    [onIndexChange, setIndex]
  )

  useAnimatedReaction(
    () => currentIndex.value,
    (newIndex) => runOnJS(changeIndex)(newIndex),
    [currentIndex, changeIndex]
  )

  useEffect(() => {
    translateX.value = index * -(dimensions.width + emptySpaceWidth)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowDimensions])

  useImperativeHandle(ref, () => ({
    setIndex(newIndex: number) {
      setIndex(newIndex)
      currentIndex.value = newIndex
      const index = newIndex * -(dimensions.width + emptySpaceWidth)
      translateX.value = withSpring(index, {
        damping: 800,
        mass: 1,
        stiffness: 250,
        restDisplacementThreshold: 0.02,
        restSpeedThreshold: 4,
      })
    },
    reset(animated = false) {
      refs.current?.forEach((itemRef) => itemRef.reset(animated))
    },
  }))

  useEffect(() => {
    if (index >= data.length) {
      const newIndex = data.length - 1
      setIndex(newIndex)
      currentIndex.value = newIndex
      translateX.value = newIndex * -(dimensions.width + emptySpaceWidth)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.length])

  return (
    <View pointerEvents="auto" style={[{ flex: 1 }, style]}>
      <Animated.View style={[{ flex: 1, flexDirection: 'row' }, animatedStyle]}>
        {data.map((item: any, i) => {
          const isFirst = i === 0

          const outOfLoopRenderRange =
            !isLoop ||
            (Math.abs(i - index) < data.length - (numToRender - 1) / 2 &&
              Math.abs(i - index) > (numToRender - 1) / 2)

          const hidden = Math.abs(i - index) > (numToRender - 1) / 2 && outOfLoopRenderRange

          return (
            <View
              key={keyExtractor ? keyExtractor(item, i) : item.id || item.key || item._id || item}
              style={[
                { width: dimensions.width, height: dimensions.height },
                isFirst ? {} : { marginLeft: emptySpaceWidth },
                { zIndex: index === i ? 1 : 0 },
              ]}
            >
              {hidden ? null : (
                // @ts-ignore
                <ResizableImage
                  {...{
                    translateX,
                    item,
                    currentIndex,
                    index: i,
                    isFirst,
                    isLast: i === data.length - 1,
                    length: data.length,
                    renderItem,
                    emptySpaceWidth,
                    doubleTapScale,
                    doubleTapInterval,
                    maxScale,
                    pinchEnabled,
                    disableTransitionOnScaledImage,
                    hideAdjacentImagesOnScaledImage,
                    disableVerticalSwipe,
                    disableSwipeUp,
                    loop: isLoop,
                    onScaleChange,
                    onScaleChangeRange,
                    setRef,
                    ...eventsCallbacks,
                    ...dimensions,
                  }}
                />
              )}
            </View>
          )
        })}
      </Animated.View>
    </View>
  )
}

export const SwipeGallery = React.forwardRef(GalleryComponent) as <T extends any>(
  p: GalleryProps<T> & { ref?: GalleryReactRef }
) => React.ReactElement
