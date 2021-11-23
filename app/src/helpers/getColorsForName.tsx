import * as Colors from '../constants/colors'

const all = Object.keys(Colors.light)

export const getColorsForName = (name?: string | null) => {
  const charCode = name && name.length > 0 ? name.charCodeAt(0) : 0
  const index = charCode % all.length
  return getColorsForIndex(index)
}

const getColorsForIndex = (index = 0) => {
  return all[index]
}

export type ColorShades = ReturnType<typeof getColorsForIndex>
