import React from 'react'
import { AbsoluteVStack, HStack, StackProps, VStack, useTheme } from 'snackui'

import {
  cardFrameBorderRadius,
  cardFrameWidth,
  cardFrameWidthSm,
  isWeb,
} from '../../constants/constants'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'

type CarouselSize = 'md' | 'sm'

export type SimpleCardProps = StackProps & {
  size?: CarouselSize
  slanted?: boolean
  isBehind?: boolean
}

export const SimpleCard = ({ children, size, slanted, isBehind, ...props }: SimpleCardProps) => {
  const theme = useTheme()
  return (
    <VStack
      backgroundColor={theme.backgroundColorDarker}
      marginRight={size === 'sm' ? -3 : -8}
      className="disable-hover-touch ease-in-out-faster"
      borderRadius={cardFrameBorderRadius}
      shadowColor={theme.shadowColor}
      shadowRadius={2}
      shadowOffset={{ height: 3, width: 3 }}
      position="relative"
      opacity={1}
      scale={0.95}
      {...(slanted && {
        scale: 0.85,
        perspective: 800,
        rotateY: '-18deg',
      })}
      translateX={0}
      hoverStyle={{
        scale: 0.87,
        ...(slanted && {
          // TODO bug in snackui
          scale: 0.87,
          perspective: 800,
          rotateY: '-18deg',
        }),
      }}
      pressStyle={{
        scale: 0.83,
        perspective: 800,
        rotateY: '-10deg',
      }}
      {...props}
    >
      {/* was broke on larger size too */}
      {/* on native this causes laggy scrolls */}
      {isWeb && isBehind && (
        <AbsoluteVStack
          className="ease-in-out"
          zIndex={1002}
          borderRadius={cardFrameBorderRadius}
          top={-10}
          left={0}
          bottom={-10}
          width={40}
          x={-20}
          // this makes react native work...
          backgroundColor="rgba(0,0,0,0.001)"
          shadowColor="#000"
          shadowOpacity={0.15}
          shadowRadius={20}
          shadowOffset={{ width: 10, height: 0 }}
        />
      )}
      {children}
    </VStack>
  )
}

export const SkewedCardCarousel = ({ children }: { children: any }) => {
  return (
    <ContentScrollViewHorizontal>
      <HStack paddingVertical={10}>{children}</HStack>
      <VStack width={100} height={100} />
    </ContentScrollViewHorizontal>
  )
}
