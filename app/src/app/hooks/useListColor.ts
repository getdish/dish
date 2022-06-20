import { colorNames } from '@tamagui/theme-base'

export const useListColor = (color: number | undefined | null = 0) => {
  return colorNames[(color || 0) % colorNames.length]
}
