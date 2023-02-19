import { ThemeName } from '@tamagui/core'
import { colorTokens } from '@tamagui/themes'

export const colorNames = Object.keys(colorTokens.light) as ThemeName[]

export const useListColor = (color: number | undefined | null = 0) => {
  return colorNames[(color || 0) % colorNames.length]
}
