import { AbsoluteYStack, Divider, Spacer, Theme, YStack, useMedia, useTheme } from '@dish/ui'
import React, { memo } from 'react'

import { AppIntroLogin } from '../AppIntroLogin'

export const PageFooter = memo(() => {
  const media = useMedia()
  const theme = useTheme()

  return (
    <YStack position="relative">
      <AbsoluteYStack zIndex={-1} top={-15} left={-100} right={-100} bottom={-55} rotate="-2deg">
        <Divider />
      </AbsoluteYStack>

      <YStack paddingVertical={20} alignItems="center" paddingHorizontal="5%">
        <AppIntroLogin />
      </YStack>

      {/* enough to let keyboard show below auth form */}
      <YStack height={media.sm ? 280 : 0} />
    </YStack>
  )
})
