import React, { memo } from 'react'
import { AbsoluteVStack, Divider, Spacer, Theme, VStack, useMedia } from 'snackui'

import { AppIntroLogin } from '../AppIntroLogin'

export const PageFooter = memo(() => {
  const media = useMedia()

  return (
    <VStack position="relative">
      <AbsoluteVStack
        zIndex={-1}
        top={-15}
        left={-100}
        backgroundColor="#000"
        right={-100}
        bottom={-55}
        rotate="-2deg"
      >
        <Divider />
      </AbsoluteVStack>

      <VStack paddingVertical={20} alignItems="center" paddingHorizontal="5%">
        <Theme name="dark">
          <AppIntroLogin />
        </Theme>
        <Spacer size="xxl" />
      </VStack>

      <VStack height={media.sm ? 200 : 0} />
    </VStack>
  )
})
