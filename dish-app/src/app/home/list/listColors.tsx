import {
  allColors,
  allColorsPastel,
  allDarkColor,
} from '../../../constants/colors'

export const listColors = [...allColors, ...allColorsPastel, ...allDarkColor]

export function getListColor(index?: number | null) {
  return listColors[index ?? 0]
}

export function randomListColor() {
  return Math.min(
    Math.floor(Math.random() * listColors.length),
    listColors.length - 1
  )
}
