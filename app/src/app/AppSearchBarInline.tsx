import { AppSearchBarContents } from './AppSearchBarContents'
import { drawerStore } from './drawerStore'
import { XStack } from '@dish/ui'
import { useStoreInstanceSelector } from '@dish/use-store'
import React, { Suspense } from 'react'

export const AppSearchBarInline = () => {
  const drawerStoreAtTop = useStoreInstanceSelector(drawerStore, (x) => x.snapIndex === 0)
  const isZoomed = drawerStoreAtTop

  return (
    <XStack px="$2" maw="100%" f={1} mt="$2" pos="relative">
      <XStack
        fullscreen
        r="$2"
        l="$2"
        shac={isZoomed ? '$shadowColor' : '$shadowColor'}
        shar={isZoomed ? '$4' : '$3'}
        // shof={{ height: 2, width: 0 }}
        br="$6"
        bw={0.5}
        boc="$borderColor"
        scale={isZoomed ? 1.05 : 1}
        bc="$backgroundStrong"
        zi={-1}
      />
      <Suspense fallback={null}>
        <AppSearchBarContents />
      </Suspense>
    </XStack>
  )
}
