import { order_by, restaurant } from '@dish/graph'
import { isPresent } from '@dish/helpers'

export const useRestaurantPhotos = (restaurant?: restaurant | null) => {
  const mainPhoto = restaurant?.image
  const otherPhotos =
    restaurant
      ?.photo_table({
        limit: 6,
        order_by: [
          {
            photo: {
              quality: order_by.desc,
            },
          },
        ],
      })
      .map((x) => x.photo.url)
      .filter(isPresent) ?? []

  const hasHero = otherPhotos[0] && mainPhoto !== otherPhotos[0]
  return {
    hasHero,
    hero: hasHero ? mainPhoto : null,
    photos: hasHero ? [mainPhoto, ...otherPhotos] : otherPhotos,
  }
}
