import React from 'react'

import { StackProps, VStack } from './Stacks'

export function BlurView({
  children,
  borderRadius,
  ...props
}: StackProps & any) {
  return children
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
