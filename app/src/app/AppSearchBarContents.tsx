import { AppMenuButton } from './AppMenuButton'
import { AppSearchInput } from './AppSearchInput'
import { Spacer, XStack, YStack } from '@dish/ui'
import React, { memo } from 'react'

export const AppSearchBarContents = memo(() => {
  return (
    <XStack ai="center" px="$2">
      <AppSearchInput />
      <Spacer size={8} />
      {/* native needs set widht */}
      <YStack w={80}>
        <AppMenuButton />
      </YStack>
    </XStack>
  )
})
