import React, { memo } from 'react'
import { AbsoluteVStack, Divider, Spacer, Theme, VStack, useTheme } from 'snackui'

import { isWeb } from '../../constants/constants'
import { AppIntroLogin } from '../AppIntroLogin'

export const PageFooter = memo(() => {
  const theme = useTheme()

  if (!isWeb) {
    return null
  }

  return (
    <VStack position="relative">
      <AbsoluteVStack
        zIndex={-1}
        top={-15}
        left={-100}
        backgroundColor="#000"
        right={-100}
        bottom={-55}
        transform={[{ rotate: '-2deg' }]}
      >
        <Divider />
      </AbsoluteVStack>

      <VStack paddingVertical={20} alignItems="center" paddingHorizontal="5%">
        <AppIntroLogin />
        <Spacer size="xxl" />
      </VStack>
    </VStack>
  )
})
