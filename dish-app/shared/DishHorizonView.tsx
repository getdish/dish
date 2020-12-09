import React from 'react'
import { AbsoluteVStack, Circle } from 'snackui'

import { green, pink, purple, yellow } from './colors'

export function DishHorizonView() {
  return (
    <AbsoluteVStack
      opacity={0.25}
      fullscreen
      borderRadius={100}
      overflow="hidden"
    >
      <AbsoluteVStack top={-60} left={100} right={0}>
        <Circle size={400} backgroundColor={pink} />
        <AbsoluteVStack opacity={0.8} left="20%">
          <Circle size={400} backgroundColor={green} />
        </AbsoluteVStack>
        <AbsoluteVStack opacity={0.8} left="40%">
          <Circle size={500} backgroundColor={yellow} />
        </AbsoluteVStack>
        <AbsoluteVStack opacity={0.8} left="60%">
          <Circle size={600} backgroundColor={purple} />
        </AbsoluteVStack>
      </AbsoluteVStack>
    </AbsoluteVStack>
  )
}
