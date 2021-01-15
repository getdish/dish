import React from 'react'
import { ScrollView } from 'react-native'
import { HStack } from 'snackui'

export const CardCarousel = ({ children }: { children: any }) => {
  return (
    <HStack marginHorizontal={-20}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack margin={20} spacing>
          {children}
        </HStack>
      </ScrollView>
    </HStack>
  )
}
