import { YStack, useMedia, useTheme } from '@dish/ui'
import React, { memo } from 'react'

import { AppIntroLogin } from '../AppIntroLogin'

export const PageFooter = memo(() => {
  const media = useMedia()
  const theme = useTheme()

  return (
    <YStack position="relative">
      <YStack py="$4" alignItems="center" paddingHorizontal="5%">
        <AppIntroLogin />
      </YStack>

      {/* enough to let keyboard show below auth form */}
      <YStack height={media.sm ? 280 : 0} />
    </YStack>
  )
})
