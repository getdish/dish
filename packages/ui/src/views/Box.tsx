import React from 'react'

import { StackProps, VStack } from './Stacks'

export function Box(props: StackProps) {
  return (
    <VStack
      backgroundColor="#fff"
      paddingVertical={8}
      paddingHorizontal={10}
      borderRadius={12}
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
