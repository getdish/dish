import { AppIntroLogin } from '../AppIntroLogin'
import { YStack, useMedia } from '@dish/ui'
import React, { memo } from 'react'

export const PageFooter = memo(() => {
  const media = useMedia()

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
