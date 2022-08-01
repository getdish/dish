import { Circle, YStack } from '@dish/ui'
import React from 'react'
import { useWindowDimensions } from 'react-native'

export const AppMapSpotlight = () => {
  const { window, size, cx, cy } = useAppMapSpotlight()

  return (
    <>
      <YStack zi={1000000000000} fullscreen pe="none">
        <Circle bc="transparent" size={size} y={cy} x={cx} className="map-spotlight" />
      </YStack>
    </>
  )
}

export const useAppMapSpotlight = () => {
  const { width, height } = useWindowDimensions()
  const overlap = 1.75
  const minSize = Math.min(width, height)
  const size = minSize * overlap
  const adjustSide = width < height ? 'width' : 'height'
  const adjustAmt = (size - minSize) / 2
  const cx = adjustSide === 'width' ? -adjustAmt : 0
  const cy = adjustSide !== 'width' ? -adjustAmt : 0

  return {
    cx,
    cy,
    size,
    window: { width, height },
  }
}
