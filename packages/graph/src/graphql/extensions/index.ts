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

export const restaurant = (restaurant) => ({
  bestTagPhotos() {
    return restaurant.tags
      ?.filter((t) => (t.photos?.length || 0) > 0 && t.rating)
      .sort((t1, t2) => (t2.rating || 0) - (t1.rating || 0))
  },
})
