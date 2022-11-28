import { colorNames } from '../app/hooks/useListColor'

export const getColorsForName = (name?: string | null) => {
  const charCode = name && name.length > 0 ? name.charCodeAt(0) : 0
  const index = charCode % colorNames.length
  return getColorsForIndex(index)
}

const getColorsForIndex = (index = 0) => {
  return colorNames[index]
}

export type ColorShades = ReturnType<typeof getColorsForIndex>
