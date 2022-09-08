import { searchBarHeight, zIndexMap } from '../constants/constants'
import { useAppMapVerticalPad } from './AppMap'
import { AppMapControls } from './AppMapControls'
import { AppMapHeader } from './AppMapHeader'
import { AppMapSpotlight } from './AppMapSpotlight'
import { Circle, XStack, YStack, useMedia } from '@dish/ui'
import React, { memo } from 'react'

export default memo(function AppMapContainer(props: { children: React.ReactNode }) {
  const media = useMedia()
  const verticalPad = useAppMapVerticalPad()

  // SMALL
  if (media.md) {
    return (
      <>
        <YStack fullscreen zi={300} px="$4" h={searchBarHeight} ai="center">
          <AppMapHeader />
          <AppMapControls />
        </YStack>
        <YStack y={-verticalPad} fullscreen position={'fixed' as any} zi={zIndexMap}>
          <AppMapSpotlight />
          <YStack f={1}>{props.children}</YStack>
        </YStack>
      </>
    )
  }

  // LARGE
  return (
    <YStack fullscreen position={'fixed' as any} zi={zIndexMap}>
      {props.children}

      <YStack zi={200} pe="none" fullscreen left="23%" ai="center" jc="center">
        <YStack fullscreen className="fade-right" />
        <Circle className="map-spotlight map-spotlight-large" size={1200} bc="transparent" />
      </YStack>

      <XStack
        pe="box-none"
        fullscreen
        top={8}
        left="60%"
        zi={300}
        px="$4"
        h={searchBarHeight}
        ai="center"
      >
        <AppMapHeader />
        <AppMapControls />
      </XStack>
    </YStack>
  )
})
