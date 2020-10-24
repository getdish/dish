import React from 'react'
import { StackProps, VStack } from 'snackui'

export const ColoredCircle = ({
  isHovered,
  size,
  isSelected,
  ...rest
}: StackProps & {
  isHovered?: boolean
  isSelected?: boolean
  size: number
}) => {
  return (
    <VStack
      position="relative"
      zIndex={isHovered ? 1 : 0}
      className="ease-in-out-faster"
      alignItems="center"
      justifyContent="center"
      pressStyle={{
        transform: [{ scale: 0.98 }],
        opacity: 1,
      }}
      hoverStyle={{
        transform: [{ scale: 1.02 }],
      }}
      width={size}
      height={size}
      borderRadius={1000}
      borderColor={isSelected ? '#000' : 'transparent'}
      shadowColor="#000"
      shadowOpacity={0.1}
      shadowRadius={4}
      {...rest}
    />
  )
}
