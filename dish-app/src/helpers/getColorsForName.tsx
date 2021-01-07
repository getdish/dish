import { allColors, allColorsPastel, allLightColors } from '../constants/colors'

if (allLightColors.length !== allColors.length) {
  throw new Error('must be same')
}

export const getColorsForName = (name: string) => {
  const index = (name ?? '').charCodeAt(0) % allLightColors.length
  return {
    altColor: allColorsPastel[(index + 1) % allLightColors.length],
    lightColor: allLightColors[index],
    color: allColorsPastel[index],
  }
}
