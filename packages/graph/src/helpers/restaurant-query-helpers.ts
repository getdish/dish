import {
  Restaurant,
  RestaurantQuery,
  RestaurantTag,
  RestaurantTagQuery,
} from '../types'
import { TopCuisineDish } from '../types-extra'

export function isRestaurantQueryResult(
  restaurant: Restaurant | RestaurantQuery
) {
  return typeof restaurant.tags == 'function'
}

export function restaurantPhotosForCarousel({
  restaurant,
  tag_names,
  max = 6,
}: {
  restaurant: Restaurant | RestaurantQuery
  tag_names?: string[]
  max?: number
}) {
  let tags: RestaurantTag[] = []
  let restaurant_photos: string[] = []
  if (isRestaurantQueryResult(restaurant)) {
    restaurant = restaurant as RestaurantQuery
    tags = restaurant.tags().map((t: RestaurantTagQuery) => {
      return {
        ...t,
        // @ts-ignore
        photos: t.photos ? t.photos() : [],
        tag: {
          ...t.tag,
          default_images: t.tag?.default_images ? t.tag?.default_images : [],
        },
      }
    })
    // @ts-ignore
    restaurant_photos = restaurant.photos() || []
  } else {
    tags = restaurant.tags
    restaurant_photos = restaurant.photos || []
  }

  let photos = [] as TopCuisineDish[]
  for (const t of tags) {
    if (!t.tag?.name) {
      console.warn('no tag name')
      continue
    }
    const is_searched_for_tag = tag_names?.includes(t.tag.name.toLowerCase())
    let [photo] = t.photos || []
    let is_fallback_image = false
    const fallback_image = t.tag?.default_images?.[0]
    if (!photo && fallback_image) {
      photo = fallback_image
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
    for (const photo of restaurant_photos) {
      photos.push({ name: ' ', image: photo })
      if (photos.length >= max) break
    }
  }
  return photos
}
