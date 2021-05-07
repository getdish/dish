import React from 'react'
import { HStack, StackProps, VStack } from 'snackui'

import { cardFrameBorderRadius } from '../../constants/constants'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'

type CarouselSize = 'md' | 'sm'

export const SkewedCard = ({ children, size, ...props }: StackProps & { size?: CarouselSize }) => {
  return (
    <VStack
      marginRight={size === 'sm' ? -10 : -38}
      className="disable-hover-touch ease-in-out-faster"
      borderRadius={cardFrameBorderRadius}
      shadowColor="#000"
      shadowOpacity={0.14}
      shadowRadius={10}
      shadowOffset={{ height: 4, width: 4 }}
      position="relative"
      opacity={1}
      scale={0.85}
      perspective={1000}
      rotateY="-15deg"
      translateX={0}
      hoverStyle={{
        scale: 0.87,
        perspective: 1000,
        rotateY: '-15deg',
      }}
      pressStyle={{
        scale: 0.83,
        perspective: 1000,
        rotateY: '-10deg',
      }}
      {...props}
    >
      {children}
    </VStack>
  )
}

export const SkewedCardCarousel = ({ children }: { children: any }) => {
  return (
    <ContentScrollViewHorizontal>
      {children}
      <VStack width={100} height={100} />
    </ContentScrollViewHorizontal>
  )
}
