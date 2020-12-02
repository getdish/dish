import { isPresent } from '@dish/helpers'

import { useRestaurantQuery } from '../hooks/useRestaurantQuery'
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
  tag_slugs?: string[]
  max?: number
}

export const getRestuarantDishes = ({
  restaurantSlug,
  tag_slugs = [],
  max = 6,
}: Props): DishTagItemSimple[] => {
  const restaurant = useRestaurantQuery(restaurantSlug)
  const tagSlugs = tag_slugs.filter(Boolean).join(',')
  let topTags = restaurant.top_tags({
    args: {
      tag_slugs: tagSlugs,
      _tag_types: 'dish',
    },
    limit: max,
  })

  topTags = prependSearchedForTags(topTags, tagSlugs)

  return (topTags ?? [])
    .map((tag) => {
      if (!tag) return null
      return selectRishDishViewSimple(tag)
    })
    .filter(isPresent)
    .filter((x) => !!x.slug)
}

// TODO: Whether it is Postgres or Hasura, having to set the ordering here should not
// be necessary. Postgres is perfectly capabale of doing this itself. However, for whatever
// reason Postgres or Hasura takes it on itself to choose a different field to order on. Hence
// we force the ordering back to its intended ordering here.
const prependSearchedForTags = (
  topTags: RestaurantTags[],
  tagSlugs: string[]
) => {
  const searchedForTags = topTags.filter((t) => tagSlugs.includes(t.tag.slug))
  const allOthers = topTags.filter((t) => !tagSlugs.includes(t.tag.slug))
  const ordered = [...searchedForTags, ...allOthers]
  return ordered
}

// const getRestuarantDishesWithPhotos = (
//   restaurant: any,
//   tag_names: string[] = [],
//   fullTags?: DishFilledTag[]
// ) => {
//   let photos: TopCuisineDish[] = []
//   const topTags = restaurant.top_tags({
//     args: {
//       tag_names: tag_names.filter(Boolean).join(','),
//     },
//     limit: 20,
//   })
//   const searchedFor: DishFilledTag[] = []
//   for (const topTag of topTags) {
//     const fullTag = fullTags?.find((x) => x.name === topTag.tag.name)
//     const tag = fullTag ?? topTag.tag
//     const tagName = tag?.name ?? ''
//     const tagNameMachined = tagName.toLowerCase().replace(' ', '-')
//     const isSearchedForTag = tag_names?.includes(tagNameMachined)
//     let [photo] = topTag.photos() || []
//     let isFallback = false
//     const defaults = topTag.tag?.default_images()
//     const fallback = defaults?.[0]
//     const photoRating = topTag.rating
//     if (!photo && fallback) {
//       photo = fallback
//       isFallback = true
//     }
//     if (!photo && !isSearchedForTag) {
//       continue
//     }
//     const photoItem = {
//       name: tagName,
//       // enablig this causes double queries if not on fullTags
//       icon: fullTag ? tag?.icon : null,
//       image: photo,
//       // fallback to 0 prevents score fetching below in DishUpvoteDownvote
//       score: fullTags ? tag?.score ?? 0 : tag?.score,
//       rating: photoRating,
//       best_restaurants: [],
//       isFallback,
//       reviews: topTag.reviews,
//     }
//     if (isSearchedForTag) {
//       searchedFor.push(photoItem)
//     } else {
//       photos.push(photoItem)
//     }
//   }
//   return [...searchedFor, ...sortBy(photos, (x) => x.score)]
// }
