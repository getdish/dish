import { SlantedTitle } from './views/SlantedTitle'
import { ThemeInverse, YStack, isWeb } from '@dish/ui'
import React from 'react'

export const AppMapHeader = () => {
  return (
    <YStack
      fullscreen
      pos={isWeb ? ('fixed' as any) : 'absolute'}
      ai="center"
      jc="center"
      h={70}
      zi={10000000000}
    >
      <ThemeInverse>
        <SlantedTitle elevation="$1" size="$2" als="center">
          Kailua
        </SlantedTitle>
      </ThemeInverse>
    </YStack>
  )
}
