import React from 'react'

import { StackBaseProps, VStack } from './Stacks'

export function Box(props: StackBaseProps) {
  return (
    <VStack
      backgroundColor="#fff"
      padding={10}
      borderRadius={9}
      shadowColor="rgba(0,0,0,0.175)"
      shadowRadius={13}
      shadowOffset={{ width: 0, height: 3 }}
      // borderWidth={1}
      // borderColor="#ddd"
      overflow="hidden"
      {...props}
    />
  )
}
