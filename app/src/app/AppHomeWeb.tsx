import React, { Suspense, useLayoutEffect } from 'react'
import { VStack } from 'snackui'

import { AppMapContents } from './AppMap'
import { HomeStackViewPages } from './home/HomeStackViewPages'
import { useHomeStore } from './homeStore'

// this would be the start of rendering mobile web flat style

export const AppHomeWeb = () => {
  const { currentState } = useHomeStore()
  console.log('currentState', currentState)

  useLayoutEffect(() => {
    document.querySelector('html')!.classList.add('mobile-layout')
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <VStack height={260} position="relative">
          <AppMapContents />
        </VStack>
        <VStack position="relative">
          <HomeStackViewPages key={currentState.id} isActive item={currentState} index={0} />
        </VStack>
      </Suspense>
    </>
  )
}
