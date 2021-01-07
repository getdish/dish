// debug
// TODO variant for width/height
import React from 'react'
import { VStack, useMedia, useTheme } from 'snackui'

export const cardFrameBorderRadius = 17
export const cardFrameWidth = 240
export const cardFrameHeight = 340

export const CardFrame = ({
  hoverable,
  expandable,
  transparent,
  children,
  aspectFixed,
}: {
  children?: any
  expandable?: boolean
  hoverable?: boolean
  transparent?: boolean
  aspectFixed?: boolean
}) => {
  const theme = useTheme()
  const media = useMedia()
  return (
    <VStack
      className="ease-in-out-faster"
      contain="layout"
      borderRadius={cardFrameBorderRadius}
      width={cardFrameWidth}
      height={cardFrameHeight}
      backgroundColor={transparent ? 'transparent' : theme.cardBackgroundColor}
      shadowColor="#000"
      shadowOpacity={transparent ? 0 : 0.1}
      shadowRadius={4}
      shadowOffset={{ height: 1, width: 0 }}
      position="relative"
      alignItems="center"
      justifyContent="center"
      {...(expandable && {
        width: cardFrameWidth * 2,
      })}
      {...(media.xs && {
        width: '90%',
      })}
      {...(aspectFixed && {
        width: cardFrameWidth,
      })}
      {...(hoverable && {
        hoverStyle: {
          transform: [{ scale: 1.015 }],
        },
        pressStyle: {
          transform: [{ scale: 0.95 }],
        },
      })}
    >
      {children}
    </VStack>
  )
}
