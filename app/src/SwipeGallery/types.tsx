import React from 'react'
import Animated from 'react-native-reanimated'

export type Props<T> = EventsCallbacks & {
  item: T
  index: number
  isFirst: boolean
  isLast: boolean
  translateX: Animated.SharedValue<number>
  currentIndex: Animated.SharedValue<number>
  renderItem: RenderItem<T>
  width: number
  height: number
  length: number
  emptySpaceWidth: number
  doubleTapInterval: number
  doubleTapScale: number
  maxScale: number
  pinchEnabled: boolean
  disableTransitionOnScaledImage: boolean
  hideAdjacentImagesOnScaledImage: boolean
  disableTapToZoom: boolean
  disablePinchToZoom: boolean
  disableVerticalSwipe: boolean
  disableSwipeUp?: boolean
  loop: boolean
  onScaleChange?: (scale: number) => void
  onScaleChangeRange?: { start: number; end: number }
  setRef: (index: number, value: ItemRef) => void
}

export type EventsCallbacks = {
  onSwipeToClose?: () => void
  onTap?: () => void
  onDoubleTap?: () => void
  onScaleStart?: () => void
  onPanStart?: () => void
}

export type RenderItem<T> = (imageInfo: RenderItemInfo<T>) => React.ReactElement | null
export type ItemRef = { reset: (animated: boolean) => void }

export type RenderItemInfo<T> = {
  index: number
  item: T
  onLayout: (e: { nativeEvent: { layout: { width: number; height: number } } }) => void
}
