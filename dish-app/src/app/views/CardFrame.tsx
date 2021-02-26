// TODO variant for width/height
import React from 'react'
import { VStack, useMedia, useTheme } from 'snackui'

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
  size,
  square,
}: {
  children?: any
  expandable?: boolean
  hoverable?: boolean
  transparent?: boolean
  aspectFixed?: boolean
  size?: 'md' | 'sm' | 'xs'
  square?: boolean
}) => {
  const theme = useTheme()
  return (
    <VStack
      className="hover-parent  ease-in-out-fast"
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
      {...(size === 'xs' && {
        minWidth: 140,
        width: 'auto',
        maxWidth: 250,
        height: 48,
      })}
      // {...(hoverable && {
      //   hoverStyle: {
      //     transform: [{ scale: 1.015 }],
      //   },
      //   pressStyle: {
      //     transform: [{ scale: 0.95 }],
      //   },
      // })}
    >
      {children}
    </VStack>
  )
}
