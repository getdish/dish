import * as Colors from '../../../constants/colors'

const lightColors = Colors.colors200
const colorSetSize = lightColors.length
export const listColors = [...lightColors, ...Colors.colors400, ...Colors.colors600]

export const getIsListColorLight = (index?: number | null) => {
  return (index || 100) > lightColors.length
}

export function getListColors(index: number | null = colorSetSize) {
  index = index || 0
  const colorOffset = index % colorSetSize
  const backgroundColor = listColors[index ?? 0] ?? Colors.grey
  const isLight = getIsListColorLight(index)
  const darkColor = Colors.colors100[colorOffset]
  const lightColor = Colors.colors600[colorOffset]
  const color = (isLight ? darkColor : lightColor) ?? '#cccccc'
  return {
    isLight,
    color,
    darkColor,
    lightColor,
    backgroundColor,
  }
}

export function randomListColor() {
  return Math.min(Math.floor(Math.random() * listColors.length), listColors.length - 1)
}
