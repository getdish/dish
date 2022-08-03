import { zIndexMap } from '../constants/constants'
import { AppMapControls } from './AppMapControls'
import { AppMapSpotlight } from './AppMapSpotlight'
import { Circle, YStack, useMedia } from '@dish/ui'
import React, { memo } from 'react'

export default memo(function AppMapContainer(props: { children: React.ReactNode }) {
  const media = useMedia()

  if (media.mdWeb) {
    return (
      <YStack fullscreen position={'fixed' as any} zi={zIndexMap}>
        <AppMapControls />
        <AppMapSpotlight />
        {props.children}
      </YStack>
    )
  }

  return (
    <YStack fullscreen position={'fixed' as any} zi={zIndexMap}>
      {props.children}

      <YStack
        $sm={{ dsp: 'none' }}
        zi={200}
        pe="none"
        fullscreen
        left="23%"
        ai="center"
        jc="center"
      >
        <YStack fullscreen className="fade-right" />
        <Circle className="map-spotlight map-spotlight-large" size={1200} bc="transparent" />
      </YStack>
    </YStack>
  )
})
