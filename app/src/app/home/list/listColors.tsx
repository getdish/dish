import { useMemo } from 'react'

import * as Colors from '../../../constants/colors'

// neon colors
const lightColors = [...Colors.colors200, '#ffffff', '#31e90b']
const darkColors = [...Colors.colors600, '#000000']
const colorSetSize = lightColors.length
export const listColors = [...lightColors, ...Colors.colors400, ...darkColors]

export const getIsListColorLight = (index?: number | null) => {
  return (index || 100) < lightColors.length
}

export function useListColors(index: number | null = colorSetSize) {
  index = index || 0
  return useMemo(() => getListColors(index), [index])
}

export function getListColors(index: number | null = colorSetSize) {
  index = index || 0
  const colorOffset = index % colorSetSize
  const backgroundColor = listColors[index] ?? Colors.grey
  const isLight = getIsListColorLight(index)
  const lightColor = Colors.colors50[colorOffset]
  const darkColor = Colors.colors600[colorOffset]
  const color = (isLight ? darkColor : lightColor) ?? '#cccccc'
  return {
    isLight,
    textColor: isLight ? '#000' : '#fff',
    color,
    darkColor,
    lightColor,
    backgroundColor,
  }
}

export type ListColors = ReturnType<typeof useListColors>

export function randomListColor() {
  return Math.min(Math.floor(Math.random() * listColors.length), listColors.length - 1)
}
