import { allColors, allLightColors } from '../../colors'

export const getDishColors = (name: string) => {
  const index = (name ?? '').charCodeAt(0) % allLightColors.length
  return {
    lightColor: allLightColors[index],
    color: allColors[index],
  }
}
