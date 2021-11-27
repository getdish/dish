import { useThemeName } from '@dish/ui'

import { getColorsForName } from '../../helpers/getColorsForName'
import { RGB } from '../../helpers/rgb'
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

  const name = useHomeStoreSelector((home) => {
    if (home.currentState.type === 'list') {
      if (home.currentState.color) {
        return home.currentState.color
      }
    }
    if (home.currentStateType === 'search') {
      if (home.currentStateLense) {
        return lenseColors[home.currentStateLense.name?.toLowerCase() || 'gems'] ?? 'pink'
      }
    }
    if (home.currentStateType === 'restaurant') {
      const state = home.currentState as HomeStateItemRestaurant
      const colors = getColorsForName(state.restaurantSlug)
      return `${colors}-dark`
    }

    return themeName
  })

  return {
    name,
  }
}
