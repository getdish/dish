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

export const SkewedCard = ({
  isBehind,
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
      {isBehind && (
        <LinearGradient
          style={[StyleSheet.absoluteFill, sheet.cardGradient]}
          start={[0, 0]}
          end={[1, 0]}
          colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0)']}
        />
      )}
    </VStack>
  )
}

const sheet = StyleSheet.create({
  cardGradient: {
    zIndex: 100,
    borderRadius: cardFrameBorderRadius,
    right: '50%',
  },
})

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
