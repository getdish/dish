import React from 'react'

import { StackBaseProps, VStack } from './Stacks'

export const Circle = ({
  size,
  ...props
}: StackBaseProps & {
  size: number
}) => {
  return (
    <VStack
      alignItems="center"
      justifyContent="center"
      borderRadius={100000000000}
      overflow="hidden"
      width={size}
      height={size}
      {...props}
    />
  )
}
