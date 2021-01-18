import React from 'react'
import { ScrollView } from 'react-native'
import { HStack } from 'snackui'

export const CardCarousel = ({ children }: { children: any }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <HStack margin={20} spacing>
        {children}
      </HStack>
    </ScrollView>
  )
}
