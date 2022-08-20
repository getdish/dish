import { useLastHomeState } from './homeStore'
import { SlantedTitle } from './views/SlantedTitle'
import { ThemeInverse, YStack, isWeb } from '@dish/ui'
import React from 'react'

export const AppMapHeader = () => {
  const state = useLastHomeState()

  return (
    <YStack pe="none" fullscreen ai="center" jc="center" h="100%" zi={10000000000}>
      <ThemeInverse>
        <SlantedTitle elevation="$1" size="$2" als="center">
          {state?.curLocName ?? 'Kailua'}
        </SlantedTitle>
      </ThemeInverse>
    </YStack>
  )
}
