import { Tag } from '@dish/graph'

import { useRestaurantQuery } from '../hooks/useRestaurantQuery'

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

export type DishTagItem = {
  name: string
  icon?: string
  score?: number
  image: string
  isFallback?: boolean
}

type Props = {
  restaurantSlug: string
  tag_names?: string[]
  max?: number
}

export const getRestuarantDishes = ({
  restaurantSlug,
  tag_names = [],
  max = 6,
}: Props): DishTagItem[] => {
  const restaurant = useRestaurantQuery(restaurantSlug)
  const tagNames = tag_names.filter(Boolean).join(',')
  const topTags = restaurant.top_tags({
    args: {
      tag_names: tagNames,
      tag_types: 'dish',
    },
    limit: max,
  })
  return (topTags ?? []).map((tag) => {
    const tagImage = tag.photos()?.[0]
    const tagFallbackImage = tagImage ? null : tag.tag?.default_images()?.[0]
    return {
      id: tag.tag.id,
      name: tag.tag.name ?? '',
      icon: tag.tag.icon ?? '',
      score: tag.score ?? 0,
      image: tagImage ?? tagFallbackImage,
      isFallback: !tagImage,
    }
  })
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
