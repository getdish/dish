import { query } from '@dish/graph'

import { LngLat } from '../types/homeTypes'
import { createRestaurantAutocomplete } from './createRestaurantAutocomplete'
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
  ].map(createRestaurantAutocomplete)
}
