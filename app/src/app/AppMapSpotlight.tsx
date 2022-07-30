import {
  BackdropBlur,
  Blur,
  BlurMask,
  Canvas,
  Circle,
  Fill,
  Group,
  Mask,
  Rect,
  vec,
} from '@shopify/react-native-skia'
import React from 'react'
import { View, useWindowDimensions } from 'react-native'

export const AppMapSpotlight = () => {
  const { width, height } = useWindowDimensions()
  const overlap = 1.75
  const minSize = Math.min(width, height)
  const size = minSize * overlap
  const adjustSide = width < height ? 'width' : 'height'
  const adjustAmt = (size - minSize) / 2
  const cx = adjustSide === 'width' ? -adjustAmt : 0
  const cy = adjustSide !== 'width' ? -adjustAmt : 0

  return (
    <View pointerEvents="none" style={{ flex: 1, zIndex: 1000000000 }}>
      <Canvas style={{ flex: 1, zIndex: 1000000000 }}>
        <Mask
          mode="luminance"
          mask={
            <Group>
              <Rect x={0} y={0} width={width} height={height} color="white" />
              <Circle cx={size / 2 + cx} cy={height / 2 + cy} r={size / 2} color="black">
                <Blur blur={70} />
              </Circle>
            </Group>
          }
        >
          <Rect x={0} y={0} width={width} height={height} color="rgba(0,0,0,0.75)"></Rect>
        </Mask>
      </Canvas>
    </View>
  )
}
