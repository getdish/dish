import React from 'react'
import { AbsoluteVStack, HStack, StackProps, VStack, useTheme } from 'snackui'

import { cardFrameBorderRadius, cardFrameWidth, isWeb } from '../../constants/constants'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'

type CarouselSize = 'md' | 'sm'

export const SimpleCard = ({
  children,
  size,
  slanted,
  isBehind,
  ...props
}: StackProps & { size?: CarouselSize; slanted?: boolean; isBehind?: boolean }) => {
  const theme = useTheme()
  return (
    <VStack
      backgroundColor={theme.backgroundColor}
      marginRight={size === 'sm' ? -3 : -8}
      className="disable-hover-touch ease-in-out-faster"
      borderRadius={cardFrameBorderRadius}
      shadowColor="#000"
      shadowOpacity={0.14}
      shadowRadius={5}
      shadowOffset={{ height: 4, width: 4 }}
      position="relative"
      opacity={1}
      scale={0.85}
      {...(slanted && {
        scale: 0.85,
        perspective: 800,
        rotateY: '-15deg',
      })}
      translateX={0}
      hoverStyle={{
        scale: 0.87,
        ...(slanted && {
          // TODO bug in snackui
          scale: 0.87,
          perspective: 800,
          rotateY: '-15deg',
        }),
      }}
      pressStyle={{
        scale: 0.83,
        perspective: 800,
        rotateY: '-10deg',
      }}
      {...props}
    >
      {/* on native this causes laggy scrolls */}
      {isWeb && isBehind && (
        <AbsoluteVStack
          className="ease-in-out"
          zIndex={1002}
          borderRadius={cardFrameBorderRadius}
          fullscreen
          x={-cardFrameWidth}
          // this makes react native work...
          backgroundColor="rgba(0,0,0,0.1)"
          shadowColor="#000"
          shadowOpacity={0.8}
          shadowRadius={100}
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
