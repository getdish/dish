import React from 'react'

import Map from './Map'
import MainPane from './MainPane'
import { View } from 'react-native'
import { ZStack } from '../ZStack'

export const LabMap = () => {
  return (
    <ZStack>
      <Map />
      <MainPane />
    </ZStack>
  )
}
