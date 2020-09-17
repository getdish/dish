import { AbsoluteVStack, Spacer, VStack } from '@dish/ui'
import { default as React, memo } from 'react'
import { Platform } from 'react-native'

import { HomeIntroLetterContent } from '../../pages/home/HomeIntroLetter'

export const PageFooter = memo(() => {
  if (Platform.OS !== 'web') {
    return null
  }

  return (
    <VStack position="relative">
      <AbsoluteVStack
        zIndex={-1}
        top={-15}
        left={-100}
        right={-100}
        bottom={-55}
        backgroundColor="#000"
        transform={[{ rotate: '-4deg' }]}
      />
      <VStack paddingVertical={20} alignItems="center" paddingHorizontal="5%">
        <VStack maxWidth={450}>
          <HomeIntroLetterContent forceVisible />
          <Spacer size="xxl" />
        </VStack>
      </VStack>
    </VStack>
  )
})
