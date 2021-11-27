import { StackProps, XStack, YStack } from '@dish/ui'
import React from 'react'

import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'

type CarouselSize = 'md' | 'sm'

export type SimpleCardProps = StackProps & {
  size?: CarouselSize
  slanted?: boolean
  isBehind?: boolean
}

export const SimpleCard = ({ children, size, slanted, isBehind, ...props }: SimpleCardProps) => {
  console.log('props', props)
  return (
    <YStack
      bc="$bg2"
      mr={size === 'sm' ? -3 : -8}
      className="disable-hover-touch ease-in-out-fast"
      borderRadius="$3"
      shadowColor="$shadowColor"
      shadowRadius={2}
      shadowOffset={{ height: 3, width: 3 }}
      position="relative"
      opacity={1}
      scale={0.95}
      translateX={0}
      hoverStyle={{
        scale: 0.975,
      }}
      pressStyle={{
        scale: 0.925,
      }}
      {...(slanted && {
        scale: 0.85,
        perspective: 800,
        rotateY: '-18deg',
        hoverStyle: {
          scale: 0.87,
          perspective: 800,
          rotateY: '-18deg',
        },
        pressStyle: {
          scale: 0.83,
          perspective: 800,
          rotateY: '-10deg',
        },
      })}
      // {...props}
    >
      {children}
    </YStack>
  )
}

export const SkewedCardCarousel = ({ children }: { children: any }) => {
  return (
    <ContentScrollViewHorizontal>
      <XStack paddingVertical={10}>{children}</XStack>
      <YStack width={100} height={100} />
    </ContentScrollViewHorizontal>
  )
}
