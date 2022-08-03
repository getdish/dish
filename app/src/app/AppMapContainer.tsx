import { zIndexMap } from '../constants/constants'
import { AppMapControls } from './AppMapControls'
import { AppMapSpotlight } from './AppMapSpotlight'
import { YStack, useMedia } from '@dish/ui'
import React, { memo } from 'react'

export default memo(function AppMapContainer(props: { children: React.ReactNode }) {
  const media = useMedia()

  if (media.smWeb) {
    return (
      <YStack fullscreen position={'fixed' as any} zi={zIndexMap}>
        <AppMapControls />
        <AppMapSpotlight />
        {props.children}
      </YStack>
    )
  }

  return (
    <YStack pos="absolute" fullscreen zi={zIndexMap}>
      {props.children}
    </YStack>
  )
})
