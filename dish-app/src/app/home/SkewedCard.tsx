import React from 'react'
import { HStack, StackProps, VStack } from 'snackui'

import { cardFrameBorderRadius } from '../../constants/constants'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'

export const SkewedCard = ({ children, ...props }: StackProps) => {
  return (
    <VStack
      marginRight={-56}
      className="disable-hover-touch ease-in-out-faster"
      borderRadius={cardFrameBorderRadius}
      shadowColor="#000"
      shadowOpacity={0.14}
      shadowRadius={10}
      shadowOffset={{ height: 4, width: 4 }}
      position="relative"
      opacity={1}
      transform={[{ scale: 0.8 }, { perspective: 1000 }, { rotateY: '-10deg' }, { translateX: 0 }]}
      hoverStyle={{
        transform: [
          { scale: 0.81 },
          { perspective: 1000 },
          { rotateY: '-10deg' },
          { translateX: 5 },
        ],
      }}
      pressStyle={{
        transform: [
          { scale: 0.78 },
          { perspective: 1000 },
          { rotateY: '-10deg' },
          { translateX: 0 },
        ],
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
      <HStack contain="paint" paddingVertical={10}>
        {children}
        <VStack width={100} height={100} />
      </HStack>
    </ContentScrollViewHorizontal>
  )
}
