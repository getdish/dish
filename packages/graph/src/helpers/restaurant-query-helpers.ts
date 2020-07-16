import { TopCuisineDish } from '../types-extra'

/**
 * Careful with query helpers, they need to be DETERMINISTIC
 * even when gqless returns the fake proxy objects.
 *
 * Basically, whenever you do a `continue` or break early, be
 * sure you already read all the properties
 *
 */

export const restaurantPhotosForCarousel = ({
  restaurant,
  tag_names = [],
  max = 6,
}: {
  restaurant: any
  tag_names?: string[]
  max?: number
}) => {
  let x = Date.now()
  const tags = restaurant.top_tags({
    args: {
      tag_names: tag_names,
    },
  })
  // @ts-ignore
  const restaurantPhotos = restaurant.photos() || []
  let photos = [] as TopCuisineDish[]
  for (const t of tags) {
    const tagName = t.tag.name ?? ''
    const isSearchedForTag = tag_names?.includes(tagName.toLowerCase())
    let [photo] = t.photos() || []
    let isFallback = false
    const fallback = t.tag?.default_images()?.[0]
    const photoName = tagName
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
      // enablig this causes double queries
      // icon: t.tag.icon,
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
  if (Date.now() - x > 50) {
    console.warn('restaurantPhotosForCarousel SLOW')
  }
  return photos
}
