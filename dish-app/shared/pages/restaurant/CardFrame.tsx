import React from 'react'
import { VStack } from 'snackui'

export const width = 260
export const height = 360
const borderRadius = 20
export const borderRadiusSmaller = borderRadius * 0.95

export const CardFrame = (props: any) => {
  return (
    <VStack
      borderRadius={borderRadius}
      width={width}
      height={height}
      backgroundColor="#fff"
      shadowColor="#000"
      shadowOpacity={0.1}
      shadowRadius={5}
      shadowOffset={{ height: 2, width: 0 }}
      borderWidth={3}
      borderColor="#fff"
      position="relative"
      {...props}
    />
  )
}
