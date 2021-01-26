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

export type HomeStateItemLocation = {
  region?: string
  center: LngLat
  span: LngLat
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
  | HomeStateItemGallery
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
  gallery: HomeStateItemGallery
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
}

export type HomeActiveTagsRecord = { [id: string]: boolean }

export type Region = {
  name: string
  slug: string
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: any[]
  }
}

export type HomeStateItemHome = HomeStateItemBase & {
  type: 'home'
  activeTags: HomeActiveTagsRecord
  region: string
  section: string
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

export type HomeStateItemGallery = HomeStateItemBase & {
  type: 'gallery'
  restaurantSlug: string
  dishId?: string
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
  slug: string
  userSlug: string
  state?: 'edit'
}
