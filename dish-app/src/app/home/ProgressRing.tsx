import React from 'react'

import CircularProgress from '../views/CircularProgress'

export const ProgressRing = ({
  size,
  percent,
  children,
  color,
  width = 3,
}: {
  size: number
  percent: number
  children?: any
  color: string
  width?: number
}) => {
  const ratio = percent / 100
  const rotation = (1 - ratio) * 180
  return (
    <CircularProgress
      fill={percent}
      size={size}
      width={width}
      tintColor={color}
      lineCap="round"
      rotation={rotation}
    >
      {children}
    </CircularProgress>
  )
}
