import React from 'react'
import { Text } from 'react-native'
import { ZStack } from './shared/views/shared/Stacks'

export function Splash() {
  return (
    <ZStack fullscreen backgroundColor="red">
      <Text>Loading</Text>
    </ZStack>
  )
}
