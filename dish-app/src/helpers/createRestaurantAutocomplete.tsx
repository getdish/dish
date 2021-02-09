import { restaurant } from '@dish/graph'

import { getAddressText } from '../app/home/restaurant/RestaurantAddressLinksRow'
import { homeStore } from '../app/homeStore'
import { createAutocomplete } from './createAutocomplete'

export function createRestaurantAutocomplete(r: restaurant) {
  return createAutocomplete({
    name: r.name ?? '',
    slug: r.slug ?? '',
    type: 'restaurant',
    icon: r.image || '📍',
    description:
      getAddressText(
        homeStore.currentState.curLocInfo ?? null,
        r.address ?? '',
        'xs'
      ) || 'No Address',
  })
}
