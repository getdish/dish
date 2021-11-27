import { AbsoluteYStack } from '@dish/ui'
import React from 'react'

export function Radar() {
  if (process.env.NODE_ENV === 'development') {
    const LagRadar = require('react-lag-radar').default
    return (
      <AbsoluteYStack bottom={20} right={20} zIndex={10000} pointerEvents="none">
        <LagRadar frames={20} speed={0.0017} size={100} inset={3} />
      </AbsoluteYStack>
    )
  }

  return null
}
