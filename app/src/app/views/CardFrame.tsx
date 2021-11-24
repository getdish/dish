import { YStack, useTheme } from '@dish/ui'
// TODO variant for width/height
import React from 'react'

import {
  cardFrameBorderRadius,
  cardFrameHeight,
  cardFrameHeightLg,
  cardFrameHeightSm,
  cardFrameWidth,
  cardFrameWidthLg,
  cardFrameWidthSm,
} from '../../constants/constants'

export type CardFrameProps = {
  aspectFixed?: boolean
  backgroundColor?: string | null
  borderColor?: string | null
  borderless?: boolean
  children?: any
  chromeless?: boolean
  className?: string
  expandable?: boolean
  flat?: boolean
  flexible?: boolean
  floating?: boolean
  overflowHidden?: boolean
  hoverEffect?: 'scale' | 'background' | null
  pressable?: boolean
  size?: 'lg' | 'md' | 'sm' | 'xs' | 'xxs'
  skew?: boolean
  square?: boolean
  transparent?: boolean
}

export const CardFrame = ({
  aspectFixed,
  borderColor,
  borderless,
  children,
  overflowHidden,
  chromeless,
  className,
  expandable,
  flat,
  flexible,
  floating,
  hoverEffect,
  pressable,
  size,
  skew,
  square,
  transparent,
}: CardFrameProps) => {
  const theme = useTheme()
  return (
    <YStack
      className={`hover-parent ease-in-out-fastest ${className || ''}`}
      contain="layout"
      borderRadius={cardFrameBorderRadius}
      width={cardFrameWidth}
      height={square ? cardFrameWidth : cardFrameHeight}
      backgroundColor={theme.bgCard}
      borderColor={borderColor as any}
      shadowColor={theme.shadowColor}
      shadowRadius={4}
      shadowOffset={{ height: 1, width: 0 }}
      position="relative"
      alignItems="center"
      maxWidth="98%"
      justifyContent="center"
      minWidth={cardFrameWidth}
      {...(flat && {
        borderRadius: 0,
      })}
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
      })}
      {...(size === 'lg' && {
        width: cardFrameWidthLg,
        minWidth: cardFrameWidthLg,
        height: cardFrameHeightLg,
        maxHeight: cardFrameHeightLg,
      })}
      {...(size === 'sm' &&
        square && {
          height: 100,
        })}
      {...(size === 'md' &&
        square && {
          height: cardFrameWidth,
        })}
      {...(size === 'lg' &&
        square && {
          height: cardFrameWidthLg,
        })}
      {...(size === 'xs' && {
        minWidth: 140,
        width: 'auto',
        maxWidth: 250,
        height: 88,
      })}
      {...(size === 'xxs' && {
        minWidth: 140,
        width: 'auto',
        maxWidth: 250,
        height: 48,
      })}
      {...(skew && {
        transform: [{ skewX: '-12deg' }],
      })}
      {...(hoverEffect === 'scale' && {
        hoverStyle: {
          transform: [{ scale: 1.015 }],
        },
        pressStyle: {
          transform: [{ scale: 0.975 }],
        },
      })}
      {...(chromeless && {
        borderRadius: 0,
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
        shadowRadius: 0,
      })}
      {...(transparent && {
        backgroundColor: 'transparent',
      })}
      {...(!borderless && {
        borderColor: theme.bg3,
        borderWidth: 1,
        hoverStyle: {
          borderColor: theme.bg3,
        },
      })}
      {...(floating && {
        shadowColor: theme.bg,
        shadowOpacity: 0.033,
        shadowRadius: 0,
        shadowOffset: { height: 3, width: 3 },
      })}
      {...(pressable && {
        pressStyle: {
          backgroundColor: theme.bgDark,
        },
      })}
      {...(flexible && {
        minWidth: 'auto',
        width: 'auto',
        flexGrow: 1,
      })}
      {...(overflowHidden && {
        overflow: 'hidden',
      })}
    >
      {children}
    </YStack>
  )
}
