import { query } from '@dish/graph'

import { getAddressText } from '../home/restaurant/RestaurantAddressLinksRow'
import { createAutocomplete } from '../state/createAutocomplete'
import { LngLat } from '../state/home-types'
import { omStatic } from '../state/omStatic'
import { getFuzzyMatchQuery } from './getFuzzyMatchQuery'

export function searchRestaurants(
  searchQuery: string,
  center: LngLat,
  span: LngLat,
  cuisine?: string
) {
  const search = (whereCondition: any) => {
    return query.restaurant({
      where: {
        ...whereCondition,
        location: {
          _st_d_within: {
            // search outside current bounds a bit
            distance: Math.max(span.lng, span.lat) * 3,
            from: {
              type: 'Point',
              coordinates: [center.lng, center.lat],
            },
          },
        },
      },
      limit: 5,
    })
  }

  return [
    ...search({
      name: {
        _ilike: searchQuery,
      },
      ...(cuisine && {
        tags: {
          tag: {
            name: {
              _eq: cuisine,
            },
          },
        },
      }),
    }),
    ...search({
      name: {
        _ilike: getFuzzyMatchQuery(searchQuery),
      },
      ...(cuisine && {
        tags: {
          tag: {
            name: {
              _eq: cuisine,
            },
          },
        },
      }),
    }),
  ].map((r) =>
    createAutocomplete({
      id: r.id,
      name: r.name,
      slug: r.slug,
      type: 'restaurant',
      icon: r.image || '📍',
      description:
        getAddressText(
          omStatic.state.home.currentState.currentLocationInfo ?? null,
          r.address ?? '',
          'xs'
        ) || 'No Address',
    })
  )
}
