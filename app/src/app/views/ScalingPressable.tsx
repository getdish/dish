import { YStack, YStackProps } from '@dish/ui'
import React from 'react'

export function ScalingPressable(props: YStackProps) {
  return (
    <YStack
      className="ease-in-out-faster"
      position="relative"
      zIndex={0}
      hoverStyle={{
        transform: [{ scale: 1.02 }],
        zIndex: 3,
      }}
      pressStyle={{
        transform: [{ scale: 0.975 }],
      }}
      {...props}
    />
  )
}
