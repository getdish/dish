import React from 'react'
import { HStack, StackProps, VStack } from 'snackui'

import { cardFrameBorderRadius } from '../views/CardFrame'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'

// TODO merge these two using SnackUI scaling once ready

export const SkewedCard = ({ children, ...props }: StackProps) => {
  return (
    <VStack
      marginRight={-75}
      className="card-hover ease-in-out-fast"
      borderRadius={cardFrameBorderRadius}
      shadowColor="#000"
      shadowOpacity={0.14}
      shadowRadius={10}
      shadowOffset={{ height: 4, width: 4 }}
      position="relative"
      transform={[
        { scale: 0.75 },
        { perspective: 1000 },
        { rotateY: '-10deg' },
      ]}
      hoverStyle={{
        transform: [
          { scale: 0.775 },
          { perspective: 1000 },
          { rotateY: '-10deg' },
          { translateX: 10 },
        ],
      }}
      pressStyle={{
        transform: [
          { scale: 0.745 },
          { perspective: 1000 },
          { rotateY: '-10deg' },
          { translateX: 8 },
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
      <HStack paddingVertical={5}>
        {children}
        <VStack width={100} height={100} />
      </HStack>
    </ContentScrollViewHorizontal>
  )
}
