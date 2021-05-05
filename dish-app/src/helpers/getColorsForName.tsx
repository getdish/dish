import {
  allColors,
  allColorsPastel,
  allDarkColor,
  allExtraLightColors,
  allLightColors,
  colorNames,
} from '../constants/colors'

if (allLightColors.length !== allColors.length) {
  throw new Error('must be same')
}

export const getColorsForName = (name?: string | null) => {
  const charCode = name && name.length > 0 ? name.charCodeAt(0) : 0
  const index = charCode % allLightColors.length
  return getColorsForIndex(index)
}

export const getColorsForColor = (color: string) => {
  const index = allColors.indexOf(color)
  return getColorsForIndex(index == -1 ? 0 : index)
}

const getColorsForIndex = (index = 0) => {
  const altIndex = (index + 1) % allLightColors.length
  return {
    name: colorNames[index],
    darkColor: allDarkColor[index],
    lightColor: allLightColors[index],
    extraLightColor: allExtraLightColors[index],
    altColor: allColors[altIndex],
    color: allColors[index],
    pastelColor: allColorsPastel[index],
    altPastelColor: allColorsPastel[altIndex],
  }
}

export type ColorShades = ReturnType<typeof getColorsForIndex>
