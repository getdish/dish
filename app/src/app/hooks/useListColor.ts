import { colorNames } from '../../constants/colors'

export const useListColor = (color: number | undefined | null = 0) => {
  return colorNames[(color || 0) % colorNames.length]
}
