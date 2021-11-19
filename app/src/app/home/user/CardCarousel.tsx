import { XStack } from '@dish/ui'
import React from 'react'
import { ScrollView } from 'react-native'

export const CardCarousel = ({ children }: { children: any }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <XStack margin={20} spacing="xs">
        {children}
      </XStack>
    </ScrollView>
  )
}
