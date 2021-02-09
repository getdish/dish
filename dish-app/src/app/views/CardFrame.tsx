// TODO variant for width/height
import React from 'react'
import { VStack, useMedia, useTheme } from 'snackui'

export const cardFrameBorderRadius = 18

export const cardFrameWidth = 250
export const cardFrameHeight = 320

export const cardFrameWidthSm = 250 * 0.7
export const cardFrameHeightSm = 320 * 0.7

export const CardFrame = ({
  hoverable,
  expandable,
  transparent,
  children,
  aspectFixed,
  size,
  square,
}: {
  children?: any
  expandable?: boolean
  hoverable?: boolean
  transparent?: boolean
  aspectFixed?: boolean
  size?: 'md' | 'sm'
  square?: boolean
}) => {
  const theme = useTheme()
  const media = useMedia()
  return (
    <VStack
      className="ease-in-out-fast"
      contain="layout"
      borderRadius={cardFrameBorderRadius}
      width={cardFrameWidth}
      height={square ? cardFrameWidth : cardFrameHeight}
      backgroundColor={transparent ? 'transparent' : theme.cardBackgroundColor}
      shadowColor="#000"
      shadowOpacity={transparent ? 0 : 0.1}
      shadowRadius={4}
      shadowOffset={{ height: 1, width: 0 }}
      position="relative"
      alignItems="center"
      justifyContent="center"
      minWidth={cardFrameWidth}
      {...(expandable && {
        width: cardFrameWidth * 2,
      })}
      {...(media.xs && {
        width: '90%',
      })}
      {...(aspectFixed && {
        width: cardFrameWidth,
      })}
      {...(size === 'sm' && {
        width: cardFrameWidthSm,
        minWidth: cardFrameWidthSm,
        height: cardFrameHeightSm,
        // maxHeight: square ? cardFrameWidth : 'auto',
      })}
      {...(size === 'sm' &&
        square && {
          height: cardFrameWidthSm,
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
