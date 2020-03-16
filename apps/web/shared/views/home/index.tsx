import React from 'react'

import Map from './Map'
import HomeMainPane from './HomeMainPane'
import { ZStack } from '../Stacks'

export const LabHome = () => {
  return (
    <ZStack>
      <Map />
      <HomeMainPane />
    </ZStack>
  )
}
