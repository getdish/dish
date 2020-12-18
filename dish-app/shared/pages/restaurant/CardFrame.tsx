// // debug
// TODO theme extraction
import React from 'react'
import { StackProps, VStack, useMedia, useTheme } from 'snackui'

import { useCardFrame } from '../home/useCardFrame'

const borderRadius = 20
export const cardFrameBorderRadiusSmaller = borderRadius * 0.95

export const CardFrame = ({
  hoverable,
  expandable,
  ...props
}: StackProps & { expandable?: boolean; hoverable?: boolean }) => {
  const { width, height } = useCardFrame()
  const theme = useTheme()
  const media = useMedia()
  const cardFrameWidthLarge = width * 2
  const expanded = !media.xs && expandable
  return (
    <VStack
      className="ease-in-out-faster"
      contain="layout"
      borderRadius={borderRadius}
      width={width}
      height={height}
      {...(expanded && {
        width: cardFrameWidthLarge,
      })}
      backgroundColor={theme.cardBackgroundColor}
      shadowColor="#000"
      shadowOpacity={0.1}
      shadowRadius={5}
      shadowOffset={{ height: 2, width: 0 }}
      // borderWidth={3}
      // borderColor="#fff"
      position="relative"
      {...(hoverable && {
        hoverStyle: {
          transform: [{ scale: 1.015 }],
        },
        pressStyle: {
          transform: [{ scale: 0.95 }],
        },
      })}
      {...props}
    />
  )
}
