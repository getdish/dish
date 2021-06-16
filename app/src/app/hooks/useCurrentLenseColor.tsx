import { useDebounceValue } from 'snackui'
import { useThemeName } from 'snackui'

import { getColorsForName } from '../../helpers/getColorsForName'
import { RGB, hexToRGB } from '../../helpers/rgb'
import { HomeStateItemRestaurant } from '../../types/homeTypes'
import { useHomeStoreSelector } from '../homeStore'

export const defaultLenseColor = {
  name: 'light',
  rgb: [0, 0, 0, 0.92] as RGB,
}

export const defaultLenseColorDark = {
  name: 'dark',
  rgb: [30, 30, 30, 0.875] as RGB,
}

const lenseColors = {
  gems: 'pink',
  drinks: 'red',
  vibe: 'blue',
  veg: 'green',
}

export const useCurrentLenseColor = () => {
  const themeName = useThemeName()
  const result = useHomeStoreSelector((home) => {
    if (home.currentStateType === 'search') {
      if (home.currentStateLense) {
        return {
          name: lenseColors[home.currentStateLense.name?.toLowerCase() || 'gems'] ?? 'pink',
          rgb: home.currentStateLense.rgb as RGB,
        }
      }
    }
    if (home.currentStateType === 'restaurant') {
      const state = home.currentState as HomeStateItemRestaurant
      const colors = getColorsForName(state.restaurantSlug)
      return {
        name: `${colors.name}-dark`,
        rgb: hexToRGB(colors.darkColor).rgb,
      }
    }
    return null
  })
  const resultDebounced = useDebounceValue(result, 40)
  const res = resultDebounced || result
  if (res) {
    return res
  }
  return themeName === 'dark' ? defaultLenseColorDark : defaultLenseColor
}