import React, { useState } from 'react'

import { isWorker } from '../../constants'
import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import { ErrorBoundary } from '../ErrorBoundary'
import { ZStack } from '../shared/Stacks'
import { HomeControlsOverlay } from './HomeControlsOverlay'
import { HomeMap } from './HomeMap'
import { HomeMapPIP } from './HomeMapPIP'
import HomeSearchBar from './HomeSearchBar'
import { HomeViewContent } from './HomeViewContent'
import { HomeViewDrawer } from './HomeViewDrawer'

export default () => {
  const [showPip, setShowPip] = useState(false)

  useDebounceEffect(
    () => {
      setShowPip(true)
    },
    100,
    []
  )

  return (
    <ZStack top={0} left={0} right={0} bottom={0}>
      {!isWorker && (
        <ErrorBoundary name="maps">
          <HomeMap />
          {showPip && <HomeMapPIP />}
        </ErrorBoundary>
      )}
      <HomeControlsOverlay />
      <HomeSearchBar />
      <HomeViewDrawer>
        <HomeViewContent />
      </HomeViewDrawer>
    </ZStack>
  )
}
