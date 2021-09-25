import { useMemo } from 'react'
import { useThemeName } from 'snackui'

import * as Colors from '../../../constants/colors'

// neon colors
const lightColors = [...Colors.colors200, '#ffffff', '#31e90b']
const mediumColors = [...Colors.colors400, '#777777', '#815c0b']
const darkColors = [...Colors.colors800, '#000000', '#10410a']
const colorSetSize = lightColors.length
export const listColors = [...lightColors, ...mediumColors, ...darkColors]

export const getIsListColorLight = (index?: number | null) => {
  return (index || 100) <= lightColors.length
}

export function useListColors(index: number | null = colorSetSize) {
  const themeName = useThemeName()
  index = index || 0
  return useMemo(() => {
    const colors = getListColors(index)
    return {
      ...colors,
      colorForTheme: themeName === 'dark' ? colors.lightColor : colors.darkColor,
      backgroundForTheme: themeName === 'dark' ? colors.darkColor : colors.lightColor,
    }
  }, [index, themeName])
}

export function getListColors(index: number | null = colorSetSize) {
  index = index || 0
  const colorOffset = index % colorSetSize
  const backgroundColor = listColors[index] ?? Colors.grey
  const isLight = getIsListColorLight(index)
  const lightColor = lightColors[colorOffset]
  const darkColor = darkColors[colorOffset]
  const color = (isLight ? darkColor : lightColor) ?? '#cccccc'
  console.log('colorOffset', colorOffset, {
    isLight,
    textColor: isLight ? '#000000' : '#ffffff',
    color,
    darkColor,
    lightColor,
    backgroundColor,
  })
  return {
    isLight,
    textColor: isLight ? '#000000' : '#ffffff',
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
