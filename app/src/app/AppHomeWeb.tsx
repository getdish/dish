import React, { Suspense } from 'react'
import { VStack } from 'snackui'

import { AppMapContents } from './AppMap'
import { HomeStackViewPages } from './home/HomeStackViewPages'
import { useHomeStore } from './homeStore'

// this would be the start of rendering mobile web flat style

export const AppHomeWeb = () => {
  const { currentState } = useHomeStore()

  return (
    <>
      <Suspense fallback={null}>
        <VStack height={260} position="relative">
          <AppMapContents />
        </VStack>
        <HomeStackViewPages key={currentState.id} isActive item={currentState} index={0} />
      </Suspense>
    </>
  )
}
