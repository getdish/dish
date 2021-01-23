import React from 'react'
import { ScrollView } from 'react-native'
import { HStack, StackProps, VStack } from 'snackui'

import { cardFrameBorderRadius } from '../views/CardFrame'

export const SkewedCard = (props: StackProps) => {
  return (
    <VStack
      marginRight={-105}
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
    />
  )
}

export const SkewedCardCarousel = ({ children }: { children: any }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <HStack paddingVertical={5}>
        {children}
        <VStack width={100} height={100} />
      </HStack>
    </ScrollView>
  )
}