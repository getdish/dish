import React from 'react'
import { Polygon, Svg } from 'react-native-svg'

export const Arrow = () => {
  return (
    <Svg width={12} height={12} viewBox="0 0 100 100">
      <Polygon points="50 15, 100 100, 0 100" fill="#ddd" />
    </Svg>
  )
}
