// TODO variant for width/height
import React from 'react'
import { AbsoluteVStack, VStack, useTheme } from 'snackui'

import {
  cardFrameBorderRadius,
  cardFrameHeight,
  cardFrameHeightLg,
  cardFrameHeightSm,
  cardFrameWidth,
  cardFrameWidthLg,
  cardFrameWidthSm,
} from '../../constants/constants'

export const CardFrame = ({
  hoverEffect,
  expandable,
  transparent,
  children,
  aspectFixed,
  borderColor,
  backgroundColor,
  size,
  square,
  chromeless,
  className,
  floating,
  flat,
  skew,
  borderless,
}: {
  children?: any
  className?: string
  expandable?: boolean
  hoverEffect?: 'scale' | 'background' | false
  transparent?: boolean
  floating?: boolean
  aspectFixed?: boolean
  size?: 'md' | 'sm' | 'xs' | 'lg'
  flat?: boolean
  square?: boolean
  skew?: boolean
  borderColor?: string | null
  backgroundColor?: string | null
  chromeless?: boolean
  borderless?: boolean
}) => {
  const theme = useTheme()
  return (
    <VStack
      className={`hover-parent ease-in-out-fastest ${className || ''}`}
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
      {...(!borderless && {
        borderColor: theme.backgroundColorDarker,
        borderWidth: 1,
      })}
      {...(floating && {
        shadowColor: theme.shadowColor,
        shadowRadius: 1,
        shadowOffset: { height: 4, width: 4 },
      })}
    >
      {/* background */}
      {!!backgroundColor && (
        <AbsoluteVStack
          fullscreen
          className="hover-100-opacity-child chrome-fix-overflow safari-fix-overflow"
          scale={1}
          overflow="hidden"
          borderRadius={flat ? 0 : cardFrameBorderRadius}
          backgroundColor={backgroundColor}
          {...(hoverEffect === 'background' && {
            opacity: 0.6,
          })}
        />
      )}
      {children}
    </VStack>
  )
}
