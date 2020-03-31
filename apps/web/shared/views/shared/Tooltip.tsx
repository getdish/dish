import React from 'react'

import { StackBaseProps, VStack } from './Stacks'

export function Tooltip(props: StackBaseProps) {
  return (
    <VStack
      backgroundColor="#fff"
      padding={10}
      borderRadius={12}
      shadowColor="rgba(0,0,0,0.2)"
      shadowRadius={14}
      shadowOffset={{ width: 0, height: 2 }}
      {...props}
    />
  )
}
