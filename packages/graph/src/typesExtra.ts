import { MenuItem, Restaurant, Review, Tag } from './types'

export type RestaurantOnlyIds = {
  id: string
  slug: string
  rish_rank?: number
  restaurant_rank?: number
}

export type RestaurantOnlyIdsPartial = {
  slug?: RestaurantOnlyIds['slug'] | null
  id?: RestaurantOnlyIds['id'] | null
  rish_rank?: number
  restaurant_rank?: number
}

export type TagType =
  | 'root'
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

export type TopCuisineDish = {
  name: string
  rating?: number
  icon?: string
  count?: number
  score?: number
  image: string
  best_restaurants?: Restaurant[]
  isFallback?: boolean
  reviews?: Review[]
}

export type HomeMeta = {
  query: string
  tags: string
  main_tag: string
  deliveries: string
  prices: string
  limit: string
  scores: {
    highest_score: number
    weights: {
      rishes: number
      main_tag: number
      restaurant_base: number
      rishes_votes_ratio: number
      main_tag_votes_ratio: number
      restaurant_base_votes_ratio: number
    }
  }
}

export type TopCuisine = {
  country: string
  icon: string
  frequency: number
  avg_score: number
  dishes: TopCuisineDish[]
  top_restaurants: Partial<Restaurant>[]
  tag_slug: string
  tag_id: string
}

export type MapPosition = {
  center: LngLat
  span: LngLat
}

export type RestaurantSearchArgs = MapPosition & {
  query: string
  tags?: string[]
  limit?: number
  main_tag?: string
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
