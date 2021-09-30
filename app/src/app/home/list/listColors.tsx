import { useMemo } from 'react'
import { useThemeName } from 'snackui'

import * as Colors from '../../../constants/colors'

// neon colors
const lightColors = [...Colors.colors200, '#ffffff', '#31e90b']
const mediumColors = [...Colors.colors400, '#777777', '#815c0b']
const darkColors = [...Colors.colors600, '#000000', '#10410a']
const colorSetSize = lightColors.length
export const listColors = [...lightColors, ...mediumColors, ...darkColors]

export const getIsListColorLight = (index?: number | null) => {
  return (index || 100) <= lightColors.length
}

export function useListColors(index: number | null = colorSetSize) {
  const themeName = useThemeName()
  index = index || 0
  return useMemo(() => {
    return getListColors(index, themeName)
  }, [index, themeName])
}

export function getListColors(index: number | null = colorSetSize, themeName?: string) {
  index = index || 0
  const colorOffset = index % colorSetSize
  const backgroundColor = listColors[index] ?? Colors.grey
  const isLight = getIsListColorLight(index)
  const lightColor = lightColors[colorOffset]
  const darkColor = darkColors[colorOffset]
  // to allow light theme to go dark
  // const oppositeColor = backgroundColor === darkColor ? lightColor : darkColor
  const color = (isLight ? darkColor : lightColor) ?? '#cccccc'
  return {
    isLight,
    textColor: isLight ? '#000000' : '#ffffff',
    color,
    darkColor,
    lightColor,
    backgroundColor,
    colorForTheme: themeName === 'dark' ? lightColor : darkColor,
    backgroundForTheme: themeName === 'dark' ? darkColor : lightColor,
  }
}

export type ListColors = ReturnType<typeof useListColors>

export function randomListColor() {
  return Math.min(Math.floor(Math.random() * listColors.length), listColors.length - 1)
}
