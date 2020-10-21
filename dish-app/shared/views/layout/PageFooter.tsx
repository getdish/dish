import React, { memo } from 'react'
import { Platform } from 'react-native'
import { AbsoluteVStack, Spacer, VStack } from 'snackui'

import { AppIntroLogin } from '../../AppIntroLogin'

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
        transform={[{ rotate: '-2deg' }]}
      />
      <VStack paddingVertical={20} alignItems="center" paddingHorizontal="5%">
        <VStack>
          <AppIntroLogin />
          <Spacer size="xxl" />
        </VStack>
      </VStack>
    </VStack>
  )
})
