import { allColors, allColorsPastel, allLightColors } from '../constants/colors'

if (allLightColors.length !== allColors.length) {
  throw new Error('must be same')
}

export const getColorsForName = (name: string) => {
  const index = (name ?? '').charCodeAt(0) % allLightColors.length
  const altIndex = (index + 1) % allLightColors.length
  return {
    lightColor: allLightColors[index],
    altColor: allColors[altIndex],
    color: allColors[index],
    pastelColor: allColorsPastel[index],
    altPastelColor: allColorsPastel[altIndex],
  }
}
