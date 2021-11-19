import { AbsoluteYStack, Circle } from '@dish/ui'
import React from 'react'

import { green, pink, purple, yellow } from '../../constants/colors'

export function DishHorizonView() {
  return (
    <AbsoluteYStack opacity={1} fullscreen overflow="hidden">
      <AbsoluteYStack top={-170} left={100} right={0}>
        <AbsoluteYStack top={-120} opacity={0.7}>
          <Circle size={450} backgroundColor={pink} />
        </AbsoluteYStack>
        <AbsoluteYStack top={-50} opacity={0.46} left="20%">
          <Circle size={400} backgroundColor={green} />
        </AbsoluteYStack>
        <AbsoluteYStack top={0} opacity={0.45} left="40%">
          <Circle size={500} backgroundColor={yellow} />
        </AbsoluteYStack>
        <AbsoluteYStack opacity={0.7} left="65%">
          <Circle size={700} backgroundColor={purple} />
        </AbsoluteYStack>
      </AbsoluteYStack>
    </AbsoluteYStack>
  )
}
