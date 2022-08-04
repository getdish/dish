import { useAppMapSpotlight } from './useAppMapSpotlight'
import { Circle, YStack } from '@dish/ui'
import React from 'react'

// only rendered on small web

export const AppMapSpotlight = () => {
  const { window, size, cx, cy } = useAppMapSpotlight({
    overlap: 1.2,
    yPct: -15,
  })

  return (
    <>
      <YStack zi={200} fullscreen pe="none">
        <Circle bc="transparent" size={size} y={cy} x={cx} className="map-spotlight" />
      </YStack>
    </>
  )
}
