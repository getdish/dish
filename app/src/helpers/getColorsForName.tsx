import * as Colors from '../constants/colors'

export const getColorsForName = (name?: string | null) => {
  const charCode = name && name.length > 0 ? name.charCodeAt(0) : 0
  const index = charCode % Colors.colorNames.length
  return getColorsForIndex(index)
}

const getColorsForIndex = (index = 0) => {
  return Colors.colorNames[index]
}

export type ColorShades = ReturnType<typeof getColorsForIndex>
