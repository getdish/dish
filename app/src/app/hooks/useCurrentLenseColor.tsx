import { useDebounceValue } from '@dish/ui'
import { useThemeName } from '@dish/ui'

import { getColorsForName } from '../../helpers/getColorsForName'
import { RGB, hexToRGB } from '../../helpers/rgb'
import { HomeStateItemRestaurant } from '../../types/homeTypes'
import { useHomeStoreSelector } from '../homeStore'

export const defaultLenseColor = {
  name: 'light',
  rgb: [255, 255, 255, 1] as RGB,
}

export const defaultLenseColorDark = {
  name: 'dark',
  rgb: [0, 0, 0, 1] as RGB,
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
    if (home.currentState.type === 'list') {
      if (home.currentState.color) {
        return {
          name: home.currentState.color,
          rgb: hexToRGB(home.currentState.color).rgb,
        }
      }
    }
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
        name: `${colors}-dark`,
        rgb: hexToRGB(colors).rgb,
      }
    }
    return null
  })
  if (result) {
    return result
  }
  return themeName.startsWith('dark') ? defaultLenseColorDark : defaultLenseColor
}
