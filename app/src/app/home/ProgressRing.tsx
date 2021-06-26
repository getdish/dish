import React from 'react'

import { CircularProgress } from '../views/CircularProgress'

export const ProgressRing = ({
  size,
  percent,
  children,
  color,
  width = 3,
  backgroundColor,
}: {
  size: number
  percent: number
  children?: any
  color: string
  width?: number
  backgroundColor?: string
}) => {
  const ratio = (percent ?? 0) / 100
  const rotation = (1 - ratio) * 180
  return (
    <CircularProgress
      fill={percent}
      size={size}
      width={width}
      tintColor={color}
      lineCap="round"
      rotation={rotation}
      backgroundColor={backgroundColor}
    >
      {children}
    </CircularProgress>
  )
}
