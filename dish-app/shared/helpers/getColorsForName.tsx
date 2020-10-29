import { allColors, allLightColors } from '../colors'

if (allLightColors.length !== allColors.length) {
  throw new Error('must be same')
}

export const getColorsForName = (name: string) => {
  const index = (name ?? '').charCodeAt(0) % allLightColors.length
  return {
    lightColor: allLightColors[index],
    color: allColors[index],
  }
}
