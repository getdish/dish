import { useAppMapSpotlight } from './useAppMapSpotlight'
import { Blur, Canvas, Circle, Group, Mask, Rect } from '@shopify/react-native-skia'
import React from 'react'
import { View } from 'react-native'

// @ts-ignore
const isRemoteDebugging = typeof DedicatedWorkerGlobalScope !== 'undefined'

export const AppMapSpotlight = () => {
  const { window, size, cx, cy } = useAppMapSpotlight({})

  if (isRemoteDebugging) {
    return null
  }

  return (
    <View pointerEvents="none" style={{ flex: 1, zIndex: 1000000000 }}>
      <Canvas style={{ flex: 1, zIndex: 1000000000 }}>
        <Mask
          mode="luminance"
          mask={
            <Group>
              <Rect x={0} y={0} width={window.width} height={window.height} color="white" />
              <Circle
                cx={size / 2 + cx}
                cy={window.height / 2 + cy}
                r={size / 2}
                color="black"
              >
                <Blur blur={70} />
              </Circle>
            </Group>
          }
        >
          <Rect
            x={0}
            y={0}
            width={window.width}
            height={window.height}
            color="rgba(0,0,0,0.75)"
          ></Rect>
        </Mask>
      </Canvas>
    </View>
  )
}
