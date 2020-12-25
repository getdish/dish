// debug
// TODO theme extraction
import React from 'react'
import { Dimensions } from 'react-native'
import { StackProps, VStack, useMedia, useTheme } from 'snackui'

const borderRadius = 17
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
      backgroundColor={theme.cardBackgroundColor}
      shadowColor="#000"
      shadowOpacity={0.1}
      shadowRadius={4}
      shadowOffset={{ height: 1, width: 0 }}
      position="relative"
      // {...(expanded && {
      //   width: cardFrameWidthLarge,
      // })}
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

export const cardFrameWidth = 240
export const cardFrameHeight = 340

// TODO tricky snackui extraction
export const useCardFrame = () => {
  const media = useMedia()

  if (media.xs) {
    const { width, height } = Dimensions.get('window')
    const cardWidth = width - 60
    return {
      width: cardWidth,
      height: Math.min(cardWidth * 1.2, height - 80),
    }
  }

  return {
    width: cardFrameWidth,
    height: cardFrameHeight,
  }
}
