import { sortBy } from 'lodash'

import { query } from '../graphql'
import { Tag } from '../types'
import { TopCuisineDish } from '../types-extra'

/**
 * Careful with query helpers, they need to be DETERMINISTIC
 * even when gqless returns the fake proxy objects.
 *
 * Basically, whenever you do a `continue` or break early, be
 * sure you already read all the properties
 *
 */

type DishFilledTag = Pick<Tag, 'name' | 'icon' | 'default_images'> & {
  score?: number
}

export const restaurantPhotosForCarousel = ({
  restaurant,
  tag_names = [],
  max = 6,
  gallery = false,
  fullTags,
}: {
  restaurant: any
  tag_names?: string[]
  max?: number
  gallery?: boolean
  fullTags?: DishFilledTag[]
}) => {
  // @ts-ignore
  const restaurantPhotos = (restaurant.photos() || []).filter(Boolean)
  let photos = [] as TopCuisineDish[]
  for (const photo of restaurantPhotos) {
    if (photos.length >= max) break
    photos.push({ name: '', image: photo, best_restaurants: [] })
  }
  if (!gallery || photos.length == 0) {
    photos = [
      ...restaurantDishesWithPhotos(restaurant, tag_names, fullTags),
      ...photos,
    ]
  }
  return photos.slice(0, max).filter(Boolean)
}

export const restaurantDishesWithPhotos = (
  restaurant: any,
  tag_names: string[] = [],
  fullTags?: DishFilledTag[]
) => {
  let photos: TopCuisineDish[] = []
  const topTags = restaurant.top_tags({
    args: {
      tag_names: tag_names.filter(Boolean).join(','),
    },
    limit: 20,
  })
  const searchedFor: DishFilledTag[] = []
  for (const topTag of topTags) {
    const fullTag = fullTags?.find((x) => x.name === topTag.tag.name)
    const tag = fullTag ?? topTag.tag
    const tagName = tag?.name ?? ''
    const tagNameMachined = tagName.toLowerCase().replace(' ', '-')
    const isSearchedForTag = tag_names?.includes(tagNameMachined)
    let [photo] = topTag.photos() || []
    let isFallback = false
    const defaults = topTag.tag?.default_images()
    const fallback = defaults?.[0]
    const photoRating = topTag.rating
    if (!photo && fallback) {
      photo = fallback
      isFallback = true
    }
    if (!photo && !isSearchedForTag) {
      continue
    }
    console.log('what is', fullTag, topTag, tag, tag?.score)
    const photoItem = {
      name: tagName,
      // enablig this causes double queries if not on fullTags
      icon: fullTag ? tag?.icon : null,
      image: photo,
      // fallback to 0 prevents score fetching below in DishUpvoteDownvote
      score: fullTags ? tag?.score ?? 0 : tag?.score,
      rating: photoRating,
      best_restaurants: [],
      isFallback,
      reviews: topTag.reviews,
    }
    if (isSearchedForTag) {
      searchedFor.push(photoItem)
    } else {
      photos.push(photoItem)
    }
  }
  return [...searchedFor, ...sortBy(photos, (x) => x.score)]
}
