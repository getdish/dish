import {
  allColors,
  allColorsPastel,
  allDarkColor,
} from '../../../constants/colors'

export const listColors = [...allColors, ...allColorsPastel, ...allDarkColor]

export function getListColor(index: number) {
  return listColors[index]
}
