import { AbsoluteVStack, Spacer, VStack } from '@dish/ui'
import { default as React, memo } from 'react'

import { HomeIntroLetterContent } from './HomeIntroLetter'

export const HomeFooter = memo(() => {
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
          <HomeIntroLetterContent />
          <Spacer size="xxl" />
        </VStack>
      </VStack>
    </VStack>
  )
})
