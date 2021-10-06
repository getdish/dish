import { restaurant } from '@dish/graph'

import { getAddressText } from '../app/home/restaurant/RestaurantAddressLinksRow'
import { homeStore } from '../app/homeStore'
import { createAutocomplete } from './createAutocomplete'
import { roundCoord } from './mapHelpers'

export function createRestaurantAutocomplete(r: restaurant) {
  console.log('is', r.name, r.address)
  return createAutocomplete({
    key: `${r.address?.split(' ')?.[0] || ''}-${roundCoord(
      r.location?.coordinates[0],
      100
    )}-${roundCoord(r.location?.coordinates[1], 100)}`,
    name: r.name ?? '',
    id: r.id ?? '',
    slug: r.slug ?? '',
    type: 'restaurant',
    icon: r.image || '📍',
    description:
      getAddressText(homeStore.currentState.curLocInfo ?? null, r.address ?? '', 'xs') ||
      'No Address',
  })
}
