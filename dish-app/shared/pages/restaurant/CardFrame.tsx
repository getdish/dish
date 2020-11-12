import React from 'react'
import { StackProps, VStack } from 'snackui'

export const width = 230
export const height = 320
const borderRadius = 20
export const borderRadiusSmaller = borderRadius * 0.95

export const CardFrame = (props: StackProps & { hoverable?: boolean }) => {
  return (
    <VStack
      className="ease-in-out-faster"
      contain="layout"
      borderRadius={borderRadius}
      width={width}
      height={height}
      backgroundColor="#fff"
      shadowColor="#000"
      shadowOpacity={0.1}
      shadowRadius={5}
      shadowOffset={{ height: 2, width: 0 }}
      // borderWidth={3}
      // borderColor="#fff"
      position="relative"
      {...(props.hoverable && {
        hoverStyle: {
          transform: [{ scale: 1.02 }],
        },
      })}
      {...props}
    />
  )
}
