import * as Colors from '../constants/colors'

if (Colors.colors.length !== Colors.colors100.length) {
  throw new Error('must be same')
}

export const getColorsForName = (name?: string | null) => {
  const charCode = name && name.length > 0 ? name.charCodeAt(0) : 0
  const index = charCode % Colors.colors.length
  return getColorsForIndex(index)
}

export const getColorsForColor = (color: string) => {
  const index = Colors.colors.indexOf(color)
  return getColorsForIndex(index == -1 ? 0 : index)
}

const getColorsForIndex = (index = 0) => {
  return Colors.colorObjects[index]
}

export type ColorShades = ReturnType<typeof getColorsForIndex>
