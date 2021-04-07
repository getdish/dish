import { getColorsForName } from '../../helpers/getColorsForName'
import { RGB, hexToRGB } from '../../helpers/hexToRGB'
import { HomeStateItemRestaurant } from '../../types/homeTypes'
import { useHomeStore } from '../homeStore'

export const defaultLenseColor = {
  name: 'grey',
  rgb: [20, 20, 20] as RGB,
}

export const useCurrentLenseColor = () => {
  const homeStore = useHomeStore()
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
  return defaultLenseColor
}
