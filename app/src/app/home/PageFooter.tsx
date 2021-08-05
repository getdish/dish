import React, { memo } from 'react'
import { AbsoluteVStack, Divider, Spacer, Theme, VStack, useMedia, useTheme } from 'snackui'

import { AppIntroLogin } from '../AppIntroLogin'

export const PageFooter = memo(() => {
  const media = useMedia()
  const theme = useTheme()

  return (
    <VStack position="relative">
      <AbsoluteVStack zIndex={-1} top={-15} left={-100} right={-100} bottom={-55} rotate="-2deg">
        <Divider />
      </AbsoluteVStack>

      <VStack paddingVertical={20} alignItems="center" paddingHorizontal="5%">
        <AppIntroLogin />
      </VStack>

      {/* enough to let keyboard show below auth form */}
      <VStack height={media.sm ? 280 : 0} />
    </VStack>
  )
})
