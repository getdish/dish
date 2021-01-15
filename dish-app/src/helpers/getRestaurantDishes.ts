import { restaurant_tag } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { useMemo } from 'react'

import { queryRestaurant } from '../queries/queryRestaurant'
import {
  DishTagItemSimple,
  selectRishDishViewSimple,
} from './selectDishViewSimple'

/**
 * Careful with query helpers, they need to be DETERMINISTIC
 * even when gqless returns the fake proxy objects.
 *
 * Basically, whenever you do a `continue` or break early, be
 * sure you already read all the properties
 *
 */

// type DishFilledTag = Pick<Tag, 'name' | 'icon' | 'default_images'> & {
//   score?: number
// }

export interface DishTagItem extends Omit<DishTagItemSimple, 'slug' | 'id'> {
  id?: string
  slug?: string
}

type Props = {
  restaurantSlug: string
  tagSlugs?: string[]
  max?: number
}

export const getRestaurantDishes = ({
  restaurantSlug,
  tagSlugs = [],
  max = 6,
}: Props): DishTagItemSimple[] => {
  const [restaurant] = queryRestaurant(restaurantSlug)
  let topTags = restaurant.top_tags({
    args: {
      tag_slugs: tagSlugs.filter(isPresent).join(','),
      _tag_types: 'dish',
    },
    limit: max,
  })

  topTags = prependSearchedForTags(topTags, tagSlugs)

  return useMemo(
    () =>
      (topTags ?? [])
        .map((tag) => {
          if (!tag) return null
          return selectRishDishViewSimple(tag)
        })
        .filter(isPresent)
        .filter((x) => !!x.slug),
    [topTags]
  )
}

// TODO: Whether it is Postgres or Hasura, having to set the ordering here should not
// be necessary. Postgres is perfectly capabale of doing this itself. However, for whatever
// reason Postgres or Hasura takes it on itself to choose a different field to order on. Hence
// we force the ordering back to its intended ordering here.
const prependSearchedForTags = (
  topTags: restaurant_tag[],
  tagSlugs: string[]
) => {
  const searchedForTags = topTags.filter((t) => tagSlugs.includes(t.tag.slug))
  const allOthers = topTags.filter((t) => !tagSlugs.includes(t.tag.slug))
  const ordered = [...searchedForTags, ...allOthers]
  return ordered
}
