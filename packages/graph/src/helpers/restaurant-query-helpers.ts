import { RestaurantQuery } from '../types'
import { TopCuisineDish } from '../types-extra'

// notice these helpers are for queries!

export function restaurantPhotosForCarousel({
  restaurant,
  tag_names,
  max = 6,
}: {
  restaurant: RestaurantQuery
  tag_names?: string[]
  max?: number
}) {
  let photos = [] as TopCuisineDish[]
  for (const t of restaurant.tags()) {
    if (!t.tag.name) {
      console.warn('no tag name')
      continue
    }
    const is_searched_for_tag = tag_names?.includes(t.tag.name.toLowerCase())
    let [photo] = t.photos() ?? []
    let is_fallback_image = false
    if (!photo) {
      photo = t.tag.default_images()?.[0]
      is_fallback_image = true
    }
    if (!photo && !is_searched_for_tag) {
      continue
    }
    let photo_name = t.tag.name || ' '
    if (t.tag.icon) {
      photo_name = t.tag.icon + photo_name
    }
    photos.push({
      name: photo_name,
      image: photo,
      rating: t.rating,
      is_fallback_image,
    })
    if (photos.length >= max) break
  }
  if (photos.length <= max) {
    const restPhotos = restaurant.photos() ?? []
    for (const photo of restPhotos) {
      photos.push({ name: ' ', image: photo })
      if (photos.length >= max) break
    }
  }
  return photos
}
