import { MenuItem, Restaurant, Tag } from './types'

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

export type TopCuisineDish = Partial<MenuItem> & {
  rating?: number
  count?: number
  image: string
  isFallback?: boolean
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
