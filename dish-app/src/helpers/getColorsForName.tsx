import { allColors, allLightColors } from '../constants/colors'

if (allLightColors.length !== allColors.length) {
  throw new Error('must be same')
}

export const getColorsForName = (name: string) => {
  const index = (name ?? '').charCodeAt(0) % allLightColors.length
  return {
    altColor: allColors[(index + 1) % allLightColors.length],
    lightColor: allLightColors[index],
    color: allColors[index],
  }
}
