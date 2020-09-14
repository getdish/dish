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
  gallery = false,
}: {
  restaurant: any
  tag_names?: string[]
  max?: number
  gallery?: boolean
}) => {
  // @ts-ignore
  const restaurantPhotos = (restaurant.photos() || []).filter(Boolean)
  let photos = [] as TopCuisineDish[]
  for (const photo of restaurantPhotos) {
    if (photos.length >= max) break
    photos.push({ name: '', image: photo, best_restaurants: [] })
  }
  if (!gallery || photos.length == 0) {
    photos = [...restaurantDishesWithPhotos(restaurant, tag_names), ...photos]
  }
  return photos.slice(0, max).filter(Boolean)
}

export const restaurantDishesWithPhotos = (
  restaurant: any,
  tag_names: string[] = []
) => {
  let photos: TopCuisineDish[] = []
  const tags = restaurant.top_tags({
    args: {
      tag_names: tag_names.join(','),
    },
    limit: 100,
  })
  for (const t of tags) {
    const tagName = t.tag.name ?? ''
    if (tagName) {
      const isSearchedForTag = tag_names?.includes(tagName.toLowerCase())
      let [photo] = t.photos() || []
      let isFallback = false
      const fallback = t.tag?.default_images()?.[0]
      const photoRating = t.rating
      if (!photo && fallback) {
        photo = fallback
        isFallback = true
      }
      if (!photo && !isSearchedForTag) {
        continue
      }
      const photoItem = {
        name: tagName,
        // enablig this causes double queries
        // icon: t.tag.icon,
        image: photo,
        rating: photoRating,
        best_restaurants: [],
        isFallback,
        reviews: t.reviews,
      }
      if (isSearchedForTag) {
        photos.unshift(photoItem)
      } else {
        photos.push(photoItem)
      }
    }
  }
  return photos
}
