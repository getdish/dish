import { useTheme } from 'snackui'

import { getColorsForName } from './getColorsForName'

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
