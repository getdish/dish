import { useTheme } from 'snackui'

import {
  allColors,
  allColorsPastel,
  allDarkColor,
  allExtraLightColors,
  allLightColors,
} from '../constants/colors'

if (allLightColors.length !== allColors.length) {
  throw new Error('must be same')
}

export const getColorsForName = (name: string) => {
  const index = (name ?? '').charCodeAt(0) % allLightColors.length
  const altIndex = (index + 1) % allLightColors.length
  return {
    darkColor: allDarkColor[index],
    lightColor: allLightColors[index],
    extraLightColor: allExtraLightColors[index],
    altColor: allColors[altIndex],
    color: allColors[index],
    pastelColor: allColorsPastel[index],
    altPastelColor: allColorsPastel[altIndex],
  }
}

export function useColorsFor(name: string) {
  const theme = useTheme()
  const colors = getColorsForName(name)
  const isDark = theme.name.startsWith('dark')
  return {
    ...colors,
    get themeColor() {
      return isDark ? colors.darkColor : colors.extraLightColor
    },
    get themeColorAlt() {
      return isDark ? colors.color : colors.darkColor
    },
  }
}
