import * as Colors from '../../../constants/colors'

export const listColors = [...Colors.colors300, ...Colors.colors400, ...Colors.colors500]

export function getListColor(index?: number | null) {
  return listColors[index ?? 0] ?? Colors.grey
}

export function randomListColor() {
  return Math.min(Math.floor(Math.random() * listColors.length), listColors.length - 1)
}
