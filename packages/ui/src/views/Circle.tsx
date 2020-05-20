import React from 'react'

import { StackProps, VStack } from './Stacks'

export const Circle = ({
  size,
  ...props
}: StackProps & {
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
