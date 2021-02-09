import React, { memo } from 'react'
import { AbsoluteVStack, Spacer, Theme, VStack } from 'snackui'

import { isWeb } from '../../constants/constants'
import { AppIntroLogin } from '../AppIntroLogin'

export const PageFooter = memo(() => {
  if (!isWeb) {
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
        backgroundColor="#eee"
        transform={[{ rotate: '-2deg' }]}
      />
      <VStack paddingVertical={20} alignItems="center" paddingHorizontal="5%">
        <AppIntroLogin />
        <Spacer size="xxl" />
      </VStack>
    </VStack>
  )
})
