import React from 'react'

import { isWorker } from '../../constants'
import { ZStack } from '../shared/Stacks'
import { HomeControlsOverlay } from './HomeControlsOverlay'
import { HomeMap } from './HomeMap'
import HomeSearchBar from './HomeSearchBar'
import { HomeViewContent } from './HomeViewContent'
import { HomeViewDrawer } from './HomeViewDrawer'

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
