import { MapPosition } from '@dish/graph'

import { NavigableTag } from './tagTypes'

export const breadCrumbTypes = {
  search: true,
  account: true,
  user: true,
  restaurant: true,
  about: true,
  blog: true,
  list: true,
  roadmap: true,
}

export interface ApplePlace {
  telephone: string
  /**
   * The name of the place.
   */
  name: string
  /**
   * The latitude and longitude for the place.
   */
  coordinate: { latitude: number; longitude: number }
  /**
   * The address of the place, formatted using its country's conventions.
   */
  formattedAddress: string
  /**
   * The geographic region associated with the place.
   */
  region: any
  /**
   * The country code associated with the place.
   */
  countryCode: string
  /**
   * The category of the place.
   */
  pointOfInterestCategory?: any | undefined
  /**
   * The country of the place.
   */
  country?: string | undefined
  /**
   * The state or province of the place.
   */
  administrativeArea?: string | undefined
  /**
   * The short code for the state or area.
   */
  administrativeAreaCode?: string | undefined
  /**
   * The city of the place.
   */
  locality?: string | undefined
  /**
   * The postal code of the place.
   */
  postCode?: string | undefined
  /**
   * The name of the area within the locality.
   */
  subLocality?: string | undefined
  /**
   * The street name at the place.
   */
  thoroughfare?: string | undefined
  /**
   * The number on the street at the place.
   */
  subThoroughfare?: string | undefined
  /**
   * A combination of thoroughfare and subthoroughfare.
   */
  fullThoroughfare?: string | undefined
  /**
   * Common names of the area in which the place resides.
   */
  areasOfInterest?: string[] | undefined
  /**
   * Common names for the local area or neighborhood of the place.
   */
  dependentLocalities?: string[] | undefined
}

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
  center?: LngLat | null
  span?: LngLat | null
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
  | HomeStateItemAccount
  | HomeStateItemRoadmap

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
  account: HomeStateItemAccount
  roadmap: HomeStateItemRoadmap
}

export type HomeStateTagNavigable = Partial<HomeStateItemBase> & {
  id: HomeStateItemBase['id']
  searchQuery: HomeStateItemBase['searchQuery']
  activeTags?: HomeActiveTagsRecord
  type: HomeStateItem['type']
  region?: string | false
}

export type HomeActiveTagsRecord = { [id: string]: boolean }

export type Region = MapPosition & {
  name: string
  slug: string
}

export type Point = [number, number]

export type MapTileID = string

export type MapRegionEvent = Region & {
  id: MapTileID
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
  type: 'home' | 'homeRegion'
  activeTags: HomeActiveTagsRecord
  region: string
  section: string
  center?: LngLat
  span?: LngLat
}

export type HomeStateItemRoadmap = HomeStateItemBase & {
  type: 'roadmap'
}

export type HomeStateItemAccount = HomeStateItemBase & {
  type: 'account'
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
  region?: string | false
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
