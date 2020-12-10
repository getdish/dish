import React from 'react'
import { StackProps, VStack } from 'snackui'

import { useIsNarrow } from '../../hooks/useIs'

export const cardFrameWidth = 240
export const cardFrameHeight = 340
const cardFrameWidthLarge = cardFrameWidth * 2
const borderRadius = 20
export const cardnFrameBorderRadiusSmaller = borderRadius * 0.95

export const CardFrame = ({
  hoverable,
  expandable,
  ...props
}: StackProps & { expandable?: boolean; hoverable?: boolean }) => {
  const isNarrow = useIsNarrow()
  const expanded = !isNarrow && expandable
  return (
    <VStack
      className="ease-in-out-faster"
      contain="layout"
      borderRadius={borderRadius}
      width={cardFrameWidth}
      height={cardFrameHeight}
      {...(expanded && {
        width: cardFrameWidthLarge,
      })}
      backgroundColor="#fff"
      shadowColor="#000"
      shadowOpacity={0.1}
      shadowRadius={5}
      shadowOffset={{ height: 2, width: 0 }}
      // borderWidth={3}
      // borderColor="#fff"
      position="relative"
      {...(hoverable && {
        hoverStyle: {
          transform: [{ scale: 1.02 }],
        },
      })}
      {...props}
    />
  )
}
