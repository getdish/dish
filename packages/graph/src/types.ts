import { dish, restaurant, review, tag, user } from './graphql'

export type Restaurant = restaurant
export type Tag = tag
export type User = user
export type Review = review
export type Dish = dish

// helper types

export type TagType =
  | 'lense'
  | 'filter'
  | 'continent'
  | 'country'
  | 'dish'
  | 'restaurant'
  | 'category'
  | 'orphan'

export type TagRecord = Partial<Tag> & Pick<Tag, 'type'>

export type LngLat = { lng: number; lat: number }

export type TopCuisineDish = Partial<Dish> & {
  rating: number
  count: number
  image: string
}

export type TopCuisine = {
  country: string
  icon: string
  frequency: number
  avg_rating: number
  dishes: TopCuisineDish[]
  top_restaurants: Partial<Restaurant>[]
}

export type RestaurantSearchArgs = {
  center: LngLat
  span: LngLat
  query: string
  tags?: string[]
  limit?: number
}

export type RatingFactors = {
  food: number
  service: number
  value: number
  ambience: number
}

export type Sources = { [key: string]: { url: string; rating: number } }

export type Point = {
  type: string
  coordinates: [number, number]
}
