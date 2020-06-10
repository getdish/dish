import { RestaurantQuery } from '../types'
import { TopCuisineDish } from '../types-extra'

/**
 * Careful with query helpers, they need to be DETERMINISTIC
 * even when gqless returns the fake proxy objects.
 *
 * Basically, whenever you do a `continue` or break early, be
 * sure you already read all the properties
 *
 */

export function restaurantPhotosForCarousel({
  restaurant,
  tag_names = [],
  max = 6,
}: {
  restaurant: RestaurantQuery
  tag_names?: string[]
  max?: number
}) {
  // @ts-ignore
  const tags = restaurant.top_tags({
    args: {
      tag_names: tag_names.join(','),
    },
  })
  // @ts-ignore
  const restaurantPhotos = restaurant.photos() || []
  let photos = [] as TopCuisineDish[]
  console.log({ tag_names, tags }, tags.length, tags[0])
  for (const t of tags) {
    const tagName = t.tag.name ?? ''
    const isSearchedForTag = tag_names?.includes(tagName.toLowerCase())
    let [photo] = t.photos() || []
    let isFallback = false
    const fallback = t.tag?.default_images()?.[0]
    const photoName = t.tag.icon ? t.tag.icon + tagName : tagName
    const photoRating = t.rating
    if (!photo && fallback) {
      photo = fallback
      isFallback = true
    }
    if (!photo && !isSearchedForTag) {
      continue
    }
    photos.push({
      name: photoName,
      image: photo,
      rating: photoRating,
      isFallback,
    })
    if (photos.length >= max) {
      break
    }
  }
  if (photos.length <= max) {
    for (const photo of restaurantPhotos) {
      photos.push({ name: ' ', image: photo })
      if (photos.length >= max) break
    }
  }
  return photos
}
