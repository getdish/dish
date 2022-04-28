import { YStack, YStackProps } from '@dish/ui'
import React from 'react'

export const ColoredCircle = ({
  size,
  isSelected,
  ...rest
}: YStackProps & {
  isSelected?: boolean
  size: number | string
}) => {
  return (
    <YStack
      position="relative"
      zIndex={0}
      className="ease-in-out-faster"
      alignItems="center"
      justifyContent="center"
      pressStyle={{
        transform: [{ scale: 0.98 }],
        opacity: 1,
      }}
      hoverStyle={{
        // zIndex: 1,
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
