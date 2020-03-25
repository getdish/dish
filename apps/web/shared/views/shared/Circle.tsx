import React from 'react'
import { VStack, StackBaseProps } from './Stacks'

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
      width={size}
      height={size}
      {...props}
    />
  )
}
