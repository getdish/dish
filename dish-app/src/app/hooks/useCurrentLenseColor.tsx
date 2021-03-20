import { getColorsForName } from '../../helpers/getColorsForName'
import { hexToRGB } from '../../helpers/hexToRGB'
import { HomeStateItemRestaurant } from '../../types/homeTypes'
import { useHomeStore } from '../homeStore'

export const defaultLenseColor = [20, 20, 20] as const

export const useCurrentLenseColor = (): readonly [number, number, number] => {
  const homeStore = useHomeStore()
  if (homeStore.currentStateType === 'search') {
    return homeStore.currentStateLense?.rgb ?? defaultLenseColor
  }
  if (homeStore.currentStateType === 'restaurant') {
    const state = homeStore.currentState as HomeStateItemRestaurant
    return hexToRGB(getColorsForName(state.restaurantSlug).darkColor).rgb
  }
  return defaultLenseColor
}
