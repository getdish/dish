// 🚨
// WARNING: using the types in this file slows builds down too much :(

export type CarouselPhoto = {
  src: string
  name?: string
  rating?: number
}

export const restaurant = (restaurant) => {
  return {
    bestTagPhotos: () => restaurantBestTagPhotos(restaurant),
    photosForCarousel: (activeTagIds: string[]) =>
      restaurantPhotosForCarousel(restaurant, activeTagIds),
  }
}

function restaurantBestTagPhotos(restaurant) {
  const tags = restaurant.tags({ limit: 6 }) ?? []
  return tags
    ?.filter((t) => (t.photos?.length || 0) > 0 && t.rating)
    .sort((t1, t2) => (t2.rating || 0) - (t1.rating || 0))
}

function restaurantPhotosForCarousel(restaurant: any, activeTagIds: string[]) {
  let photos = [] as CarouselPhoto[]
  const max_photos = 4
  const tags = restaurant.tags({
    limit: 6,
    // TODO @tom using activeTagIds to find matching tags here
    // but fall back in case not existing
    // where: {

    // }
  })
  for (const t of tags) {
    const [photo] = t.photos ?? []
    if (!photo) {
      continue
    }
    let photo_name = t.tag.name || ' '
    if (t.tag.icon) {
      photo_name = t.tag.icon + photo_name
    }
    photos.push({
      name: photo_name,
      src: photo,
      rating: t.rating,
    })
    if (photos.length >= max_photos) break
  }
  if (photos.length <= max_photos) {
    const restPhotos = restaurant.photos() ?? []
    for (const photo of restPhotos) {
      photos.push({ name: ' ', src: photo })
      if (photos.length >= max_photos) break
    }
  }
  return photos
}
