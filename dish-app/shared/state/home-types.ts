import {
  HomeMeta,
  RestaurantOnlyIds,
  RestaurantSearchItem,
  Tag,
  User,
} from '@dish/graph'
import { NavigateItem } from '@dish/router'
import { Config, IContext } from 'overmind'

import { NavigableTag } from './NavigableTag'

export type Om = IContext<Config>
export type OmState = Om['state']
export type OmStateHome = OmState['home']

export type HomeState = {
  allStates: { [key: string]: HomeStateItem }
  allUsers: { [id: string]: User }
  centerToResults: number
  currentNavItem: NavigateItem
  currentState: HomeStateItem
  currentStateLense: NavigableTag | null
  currentStateSearchQuery: HomeStateItem['searchQuery']
  currentStateType: HomeStateItem['type']
  drawerSnapPoint: number
  hoveredRestaurant: RestaurantOnlyIds | null | false
  isHoveringRestaurant: boolean
  isLoading: boolean
  isOptimisticUpdating: boolean
  lastActiveTags: Tag[]
  lastHomeState: HomeStateItemHome
  lastRestaurantState: HomeStateItemRestaurant | undefined
  lastSearchState: HomeStateItemSearch | undefined
  locationSearchQuery: string
  previousState: HomeStateItem
  refreshCurrentPage: number
  searchbarFocusedTag: Tag | null
  searchBarTagIndex: number
  searchBarTags: NavigableTag[]
  searchBarY: number
  selectedRestaurant: RestaurantOnlyIds | null
  showUserMenu: boolean
  skipNextPageFetchData: boolean
  started: boolean
  stateIds: string[]
  stateIndex: number
  states: HomeStateItem[]
  userLocation: LngLat | null
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

export type HomeStateItemBase = {
  searchQuery: string
  center: LngLat
  span: LngLat
  mapAt?: {
    center: LngLat
    span: LngLat
  } | null
  id: string
  currentLocationName?: string
  currentLocationInfo?: GeocodePlace | null
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
  results?: RestaurantOnlyIds[]
}

export type HomeStateItemBlog = HomeStateItemBase & {
  type: 'blog'
  slug?: string
}

export type HomeStateItemAbout = HomeStateItemBase & {
  type: 'about'
}

export type HomeStateItemSearch = HomeStateItemBase & {
  type: 'search' | 'userSearch'
  activeTags: HomeActiveTagsRecord
  status: 'loading' | 'complete'
  meta?: HomeMeta
  results: RestaurantSearchItem[]
  region?: string
  // for not forcing map to be always synced
  searchedCenter?: LngLat
  searchedSpan?: LngLat
  userId?: string
  username?: string
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
  results: RestaurantOnlyIds[]
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
