import React from 'react'
import { AbsoluteVStack, Circle } from 'snackui'

import {
  darkGreen,
  darkPink,
  darkPurple,
  darkYellow,
  green,
  pink,
  purple,
  yellow,
} from './colors'

export function DishHorizonView() {
  return (
    <AbsoluteVStack opacity={1} fullscreen overflow="hidden">
      <AbsoluteVStack top={-200} left={100} right={0}>
        <AbsoluteVStack top={-120} opacity={0.5}>
          <Circle size={450} backgroundColor={pink} />
        </AbsoluteVStack>
        <AbsoluteVStack top={-50} opacity={0.6} left="20%">
          <Circle size={400} backgroundColor={darkGreen} />
        </AbsoluteVStack>
        <AbsoluteVStack top={0} opacity={0.25} left="40%">
          <Circle size={500} backgroundColor={darkYellow} />
        </AbsoluteVStack>
        <AbsoluteVStack opacity={0.75} left="65%">
          <Circle size={700} backgroundColor={darkPurple} />
        </AbsoluteVStack>
      </AbsoluteVStack>
    </AbsoluteVStack>
  )
}
