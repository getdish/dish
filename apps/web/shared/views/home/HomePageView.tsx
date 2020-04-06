import React from 'react'

import { isWorker } from '../../constants'
import { ZStack } from '../shared/Stacks'
import { HomeControlsOverlay } from './HomeControlsOverlay'
import { HomeMap } from './HomeMap'
import HomeSearchBar from './HomeSearchBar'
import { HomeViewDrawer } from './HomeViewDrawer'
import { HomeViewContent } from './HomeViewContent'

export default () => {
  return (
    <ZStack top={0} left={0} right={0} bottom={0}>
      {!isWorker && <HomeMap />}
      <HomeControlsOverlay />
      <HomeSearchBar />
      <HomeViewDrawer>
        <HomeViewContent />
      </HomeViewDrawer>
    </ZStack>
  )
}
