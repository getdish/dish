import React from 'react'
import { View } from 'react-native'
import { HStack } from './Stacks'
import { Spacer } from './Spacer'

export const Divider = () => {
  return (
    <HStack width="100%">
      <Spacer flex />
      <View
        style={{ height: 1, flex: 10, backgroundColor: '#000', opacity: 0.05 }}
      />
      <Spacer flex />
    </HStack>
  )
}
