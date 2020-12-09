import { RestaurantOnlyIds, Tag, TopCuisine, User } from '@dish/graph'
import { NavigateItem } from '@dish/router'
import { Config, IContext } from 'overmind'

import { NavigableTag } from './NavigableTag'

export type Om = IContext<Config>
export type OmState = Om['state']
export type OmStateHome = OmState['home']

export type ActiveEvent = 'key' | 'pin' | 'hover' | null

export type HomeState = {
  activeAutocompleteResults: AutocompleteItem[]
  activeEvent: ActiveEvent
  activeIndex: number // index for vertical (in page), -1 = autocomplete
  allStates: { [key: string]: HomeStateItem }
  allUsers: { [id: string]: User }
  autocompleteIndex: number // index for horizontal row (autocomplete)
  autocompleteResults: AutocompleteItem[]
  centerToResults: number
  currentNavItem: NavigateItem
  currentState: HomeStateItem
  currentStateLense: NavigableTag | null
  currentStateSearchQuery: HomeStateItem['searchQuery']
  currentStateType: HomeStateItem['type']
  drawerSnapPoint: number
  hoveredRestaurant: RestaurantOnlyIds | null | false
  isAutocompleteActive: boolean
  isHoveringRestaurant: boolean
  isLoading: boolean
  isOptimisticUpdating: boolean
  lastActiveTags: Tag[]
  lastHomeState: HomeStateItemHome
  lastRestaurantState: HomeStateItemRestaurant | undefined
  lastSearchState: HomeStateItemSearch | undefined
  location: AutocompleteItem | null // for now just autocomplete item
  locationAutocompleteResults: AutocompleteItem[]
  locationSearchQuery: string
  previousState: HomeStateItem
  refreshCurrentPage: number
  searchbarFocusedTag: Tag | null
  searchBarTagIndex: number
  searchBarTags: NavigableTag[]
  searchBarY: number
  selectedRestaurant: RestaurantOnlyIds | null
  showAutocomplete: ShowAutocomplete
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

export type ShowAutocomplete = 'search' | 'location' | false

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
  | HomeStateItemReviews
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
}

export type HomeStateItemBlog = HomeStateItemBase & {
  type: 'blog'
  slug?: string
}

export type HomeStateItemAbout = HomeStateItemBase & {
  type: 'about'
}

export type HomeSearchItemMeta = {
  effective_score: number
  main_tag_normalised_score: number
  main_tag_rank: number
  main_tag_votes_ratio_normalised_score: number
  main_tag_votes_ratio_rank: number
  restaurant_base_normalised_score: number
  restaurant_base_votes_ratio_normalised_score: number
  restaurant_base_votes_ratio_rank: number
  restaurant_rank: number
  rish_rank: number
  rishes_normalised_score: number
  rishes_votes_ratio_normalised_score: number
  rishes_votes_ratio_rank: number
}

export type HomeStateItemSearch = HomeStateItemBase & {
  type: 'search' | 'userSearch'
  activeTags: HomeActiveTagsRecord
  status: 'loading' | 'complete'
  results: (RestaurantOnlyIds & {
    meta: HomeSearchItemMeta
  })[]
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

export type HomeStateItemReviews = HomeStateItemBase & {
  type: 'restaurantReviews'
  slug: string
  tagName?: string
}

export type HomeStateItemSimple = Pick<HomeStateItem, 'id' | 'type'>

export type AutocompleteItem = {
  is: 'autocomplete'
  id?: string
  icon?: string
  name: string
  description?: string
  tagId?: string
  slug?: string
  type: Tag['type'] | 'restaurant'
  center?: LngLat
  span?: LngLat
}
