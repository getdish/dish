import React, { useState } from 'react'

import { isWorker } from '../../constants'
import { ZStack } from '../shared/Stacks'
import { HomeControlsOverlay } from './HomeControlsOverlay'
import { HomeMap } from './HomeMap'
import HomeSearchBar from './HomeSearchBar'
import { HomeViewContent } from './HomeViewContent'
import { HomeViewDrawer } from './HomeViewDrawer'
import { HomeMapPIP } from './HomeMapPIP'
import { useDebounceEffect } from '../../hooks/useDebounceEffect'

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
        <>
          <HomeMap />
          {showPip && <HomeMapPIP />}
        </>
      )}
      <HomeControlsOverlay />
      <HomeSearchBar />
      <HomeViewDrawer>
        <HomeViewContent />
      </HomeViewDrawer>
    </ZStack>
  )
}
