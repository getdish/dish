import React from 'react'

import HomeMap from './HomeMap'
import HomeMainPane from './HomeMainPane'
import { ZStack } from '../shared/Stacks'

export const HomeView = () => {
  return (
    <ZStack top={0} left={0} right={0} bottom={0}>
      <HomeMap />
      <HomeMainPane />
    </ZStack>
  )
}
