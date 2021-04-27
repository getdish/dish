import { useThemeName } from 'snackui'

import { getColorsForName } from '../../helpers/getColorsForName'
import { RGB, hexToRGB } from '../../helpers/rgb'
import { HomeStateItemRestaurant } from '../../types/homeTypes'
import { useHomeStore } from '../homeStore'

export const defaultLenseColor = {
  name: 'light',
  rgb: [0, 0, 0, 0.85] as RGB,
}

export const defaultLenseColorDark = {
  name: 'dark',
  rgb: [10, 10, 10, 0.875] as RGB,
}

export const useCurrentLenseColor = () => {
  const homeStore = useHomeStore()
  const themeName = useThemeName()
  if (homeStore.currentStateType === 'search') {
    if (homeStore.currentStateLense) {
      return {
        name: 'pink',
        rgb: homeStore.currentStateLense.rgb as RGB,
      }
    }
  }
  if (homeStore.currentStateType === 'restaurant') {
    const state = homeStore.currentState as HomeStateItemRestaurant
    const colors = getColorsForName(state.restaurantSlug)
    return {
      name: colors.name,
      rgb: hexToRGB(colors.darkColor).rgb,
    }
  }
  return themeName === 'dark' ? defaultLenseColorDark : defaultLenseColor
}
