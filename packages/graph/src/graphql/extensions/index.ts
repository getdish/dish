export const Query = {}

/**
 * Add a key to a type
 */
// export const User = {
//   [GET_KEY]: (user) => user.id
// }

/**
 * Add custom data to a type
 * @example
 * query.users[0].follow()
 */
// export const User = (user) => ({
//   follow() {
//     console.log('follow', user.id)
//   }
// })

export type CarouselPhoto = {
  src: string
  name?: string
  rating?: number
}

export const restaurant = (restaurant) => {
  return {
    bestTagPhotos() {
      const tags = restaurant.tags({ limit: 6 }) ?? []
      return tags
        ?.filter((t) => (t.photos?.length || 0) > 0 && t.rating)
        .sort((t1, t2) => (t2.rating || 0) - (t1.rating || 0))
    },

    photosForCarousel() {
      let photos = [] as CarouselPhoto[]
      const max_photos = 4
      const tags = restaurant.tags({ limit: 6 }) ?? []
      for (const t of tags) {
        console.log('get em', t.photos)
        // const photos = t.photos({ limit: 1 }) ?? []
        // const photo = photos[0]
        // if (!photo) continue
        // let photo_name = t.tag.name || ' '
        // if (t.tag.icon) {
        //   photo_name = t.tag.icon + photo_name
        // }
        // photos.push({
        //   name: photo_name,
        //   src: photo,
        //   rating: t.rating,
        // })
        // if (photos.length >= max_photos) break
      }
      // if (photos.length <= max_photos) {
      //   console.log('restaurant.photos', restaurant.photos)
      //   const restPhotos =
      //     restaurant.photos({ limit: photos.length - max_photos }) ?? []
      //   for (const photo of restPhotos) {
      //     photos.push({ name: ' ', src: photo })
      //     if (photos.length >= max_photos) break
      //   }
      // }
      return photos
    },
  }
}
