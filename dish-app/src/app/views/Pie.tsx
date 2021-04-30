import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

import { useAppShouldShow } from '../AppStore'

export const Pie = ({
  size = 200,
  color = 'green',
  percent = 90,
  background,
}: {
  size: number
  percent: number
  background?: string
  color: string
}) => {
  const h = size / 2
  const dInner = getCirclePath(size, percent)
  const show = useAppShouldShow('svg')
  if (!show) {
    return null
  }
  return (
    <Svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {!!background && <Circle cx={h} cy={h} r={size / 2} fill={background} />}
      <Path transform={`translate(${h},${h})`} d={dInner} fill={color} />
    </Svg>
  )
}

function getCirclePath(size: number, percent: number) {
  const h = size / 2
  let pi = Math.PI
  const alpha = (Math.min(99.999999, percent) * 3.6) % 360
  let r = (alpha * pi) / 180
  let x = Math.sin(r) * h
  let y = Math.cos(r) * -h
  let mid = alpha > 180 ? 1 : 0
  return `M 0 0 v -${h} A ${h} ${h} 1 ` + mid + ' 1 ' + x + ' ' + y + ' z'
}
