import { MapPosition } from '@dish/graph'
import { MultiPolygon, Polygon } from '@turf/helpers'

import { NavigableTag } from './tagTypes'

export type GeocodePlace = {
  type:
    | 'place'
    | 'neighborhood'
    | 'poi'
    | 'reverseGeocode'
    | 'city'
    | 'state'
    | 'country'
    | 'street'
  name: string
  fullName?: string
  city: string
  state: string
  country: string
  center?: LngLat
  span?: LngLat
  bbox?: [number, number, number, number]
}

export type HomeStateNav = {
  tags?: NavigableTag[]
  state?: HomeStateTagNavigable
  disallowDisableWhenActive?: boolean
  replaceSearch?: boolean
}

export type LngLat = { lng: number; lat: number }

export type HomeStateItemLocation = MapPosition & {
  region?: string
}

export type HomeStateItemBase = {
  searchQuery: string
  id: string
  curLocName?: string
  curLocInfo?: GeocodePlace | null
}

export type HomeStateItem =
  | HomeStateItemHome
  | HomeStateItemSearch
  | HomeStateItemRestaurant
  | HomeStateItemUser
  | HomeStateItemReview
  | HomeStateItemAbout
  | HomeStateItemBlog
  | HomeStateItemUserEdit
  | HomeStateItemList

export type HomeStatesByType = {
  home: HomeStateItemHome
  search: HomeStateItemSearch
  restaurant: HomeStateItemRestaurant
  user: HomeStateItemUser
  restaurantReview: HomeStateItemReview
  about: HomeStateItemAbout
  blog: HomeStateItemBlog
  userEdit: HomeStateItemUserEdit
  list: HomeStateItemList
}

export type HomeStateTagNavigable = Partial<HomeStateItemBase> & {
  id: HomeStateItemBase['id']
  searchQuery: HomeStateItemBase['searchQuery']
  activeTags?: HomeActiveTagsRecord
  type: HomeStateItem['type']
  region?: string
  center?: LngLat
  span?: LngLat
}

export type HomeActiveTagsRecord = { [id: string]: boolean }

export type Region = MapPosition & {
  name: string
  slug: string
}

export type Point = [number, number]

export type RegionWithVia = Region & {
  via: 'click' | 'drag' | 'url'
}

export type RegionApiResponse = {
  name: string
  slug: string
  bbox: {
    type: 'Polygon'
    coordinates: [[Point, Point, Point, Point, Point]]
  }
  centroid: {
    type: 'Point'
    coordinates: Point
  }
}

export type RegionNormalized = RegionApiResponse & MapPosition

export type HomeStateItemHome = HomeStateItemBase & {
  type: 'home'
  activeTags: HomeActiveTagsRecord
  region: string
  section: string
  center?: LngLat
  span?: LngLat
}

export type HomeStateItemBlog = HomeStateItemBase & {
  type: 'blog'
  slug?: string
}

export type HomeStateItemAbout = HomeStateItemBase & {
  type: 'about'
}

export type HomeStateItemSearch = HomeStateItemBase & {
  type: 'search'
  activeTags: HomeActiveTagsRecord
  region?: string
  center?: LngLat
  span?: LngLat
}

export type HomeStateItemRestaurant = HomeStateItemBase & {
  type: 'restaurant'
  restaurantSlug: string
  section?: string
  sectionSlug?: string
}

export type HomeStateItemUser = HomeStateItemBase & {
  type: 'user'
  username: string
}

export type HomeStateItemReview = HomeStateItemBase & {
  type: 'restaurantReview'
  restaurantSlug: string
}

export type HomeStateItemUserEdit = HomeStateItemBase & {
  type: 'userEdit'
}

export type HomeStateItemSimple = Pick<HomeStateItem, 'id' | 'type'>

export type HomeStateItemList = HomeStateItemBase & {
  type: 'list'
  color?: string
  slug: string
  userSlug: string
  region: string
  state?: 'edit'
}
