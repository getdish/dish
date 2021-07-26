// TODO variant for width/height
import React from 'react'
import { VStack, useTheme } from 'snackui'

import {
  cardFrameBorderRadius,
  cardFrameHeight,
  cardFrameHeightSm,
  cardFrameWidth,
  cardFrameWidthSm,
} from '../../constants/constants'

export const CardFrame = ({
  hoverable,
  expandable,
  transparent,
  children,
  aspectFixed,
  borderColor,
  size,
  square,
  skew,
}: {
  children?: any
  expandable?: boolean
  hoverable?: boolean
  transparent?: boolean
  aspectFixed?: boolean
  size?: 'md' | 'sm' | 'xs'
  square?: boolean
  skew?: boolean
  borderColor?: string | null
}) => {
  const theme = useTheme()
  return (
    <VStack
      className="hover-parent ease-in-out-fastest"
      contain="layout"
      borderRadius={cardFrameBorderRadius}
      width={cardFrameWidth}
      height={square ? cardFrameWidth : cardFrameHeight}
      backgroundColor={theme.cardBackgroundColor}
      shadowColor={theme.shadowColor}
      shadowRadius={4}
      shadowOffset={{ height: 1, width: 0 }}
      position="relative"
      alignItems="center"
      justifyContent="center"
      minWidth={cardFrameWidth}
      {...(expandable && {
        width: cardFrameWidth * 2,
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
      {...(size === 'md' &&
        square && {
          height: cardFrameWidth,
        })}
      {...(size === 'xs' && {
        minWidth: 140,
        width: 'auto',
        maxWidth: 250,
        height: 48,
      })}
      {...(skew && {
        transform: [{ skewX: '-12deg' }],
      })}
      {...(hoverable && {
        hoverStyle: {
          transform: [{ scale: 1.015 }],
        },
        pressStyle: {
          transform: [{ scale: 0.975 }],
        },
      })}
    >
      {children}
    </VStack>
  )
}
