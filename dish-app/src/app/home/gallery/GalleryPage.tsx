import React, { Suspense, memo } from 'react'
import { AbsoluteVStack, LoadingItems } from 'snackui'

import { useHomeStore } from '../../homeStore'
import { Lightbox } from '../../views/Lightbox'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'

export default memo(function GalleryPage() {
  const home = useHomeStore()
  const state = home.currentState

  if (state.type === 'gallery') {
    return (
      <AbsoluteVStack
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        fullscreen
        backgroundColor="rgba(0,0,0,0.85)"
        zIndex={1000}
        pointerEvents="auto"
      >
        <AbsoluteVStack top={15} right={45} zIndex={100000}>
          <StackViewCloseButton />
        </AbsoluteVStack>
        <Suspense fallback={<LoadingItems />}>
          <Lightbox restaurantSlug={state.restaurantSlug} />
        </Suspense>
      </AbsoluteVStack>
    )
  }

  return null
})
