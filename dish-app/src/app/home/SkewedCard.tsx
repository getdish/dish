import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  StackProps,
  VStack,
} from 'snackui'

import { cardFrameBorderRadius } from '../views/CardFrame'
import { ContentScrollViewHorizontal } from '../views/ContentScrollViewHorizontal'

export const SkewedCard = ({
  children,
  ...props
}: StackProps & { isBehind?: boolean }) => {
  return (
    <VStack
      marginRight={-75}
      className="ease-in-out-faster"
      borderRadius={cardFrameBorderRadius}
      shadowColor="#000"
      shadowOpacity={0.14}
      shadowRadius={10}
      shadowOffset={{ height: 4, width: 10 }}
      position="relative"
      transform={[
        { scale: 0.75 },
        { perspective: 1000 },
        { rotateY: '-10deg' },
      ]}
      hoverStyle={{
        transform: [
          { scale: 0.76 },
          { perspective: 1000 },
          { rotateY: '-10deg' },
        ],
      }}
      pressStyle={{
        transform: [
          { scale: 0.74 },
          { perspective: 1000 },
          { rotateY: '-10deg' },
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
