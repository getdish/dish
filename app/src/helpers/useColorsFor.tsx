import { useTheme } from 'snackui'

import { getColorsForName } from './getColorsForName'

export type UseColors = ReturnType<typeof useColorsFor>

export function useColorsFor(name?: string | null) {
  const theme = useTheme()
  const colors = getColorsForName(name)
  const isDark = theme.name.startsWith('dark')
  return {
    ...colors,
    get themeColor() {
      return isDark ? colors.color800 : colors.color50
    },
    get themeColorAlt() {
      return isDark ? colors.color400 : colors.color500
    },
  }
}
