import React from 'react'
import { Text } from 'react-native'

import { ZStack } from './ui/Stacks'

export function Splash() {
  return (
    <ZStack fullscreen backgroundColor="red">
      <Text>Loading</Text>
    </ZStack>
  )
}
