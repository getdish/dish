import React from 'react'

import SearchBar from './SearchBar'
import Map from './Map'
import Bottom from './Bottom'
import { View } from 'react-native'

export const LabMap = () => {
  return (
    <ZStack>
      <Map />
      <SearchBar />
      <Bottom />
    </ZStack>
  )
}

function ZStack(props: { children: any }) {
  return <View style={{ position: 'absolute' }}>{props.children}</View>
}
