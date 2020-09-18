import { StackProps, VStack } from '@dish/ui'
import React from 'react'

export function BlurView({ children, borderRadius, ...props }: StackProps) {
  return (
    <VStack borderRadius={borderRadius} {...props}>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(20px)',
          borderRadius,
        }}
      />
      {children}
    </VStack>
  )
}
