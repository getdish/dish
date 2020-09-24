import { allLightColors } from '../../colors'

export const getDishBackgroundColor = (name: string) => {
  const index = (name ?? '').charCodeAt(0) % allLightColors.length
  return allLightColors[index]
}
