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
  allFilterTags: Tag[]
  allLenseTags: Tag[]
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
  searchBarTags: Tag[]
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
  }
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

export type HomeStateTagNavigable = Partial<HomeStateItemBase> & {
  id: HomeStateItemBase['id']
  searchQuery: HomeStateItemBase['searchQuery']
  activeTagIds?: HomeActiveTagsRecord
  type: HomeStateItem['type']
}

export type HomeActiveTagsRecord = { [id: string]: boolean }

export type HomeStateItemHome = HomeStateItemBase & {
  type: 'home'
  activeTagIds: HomeActiveTagsRecord
  results: RestaurantOnlyIds[]
}

export type HomeStateItemAbout = HomeStateItemBase & {
  type: 'about'
}

export type HomeStateItemSearch = HomeStateItemBase & {
  type: 'search' | 'userSearch'
  activeTagIds: HomeActiveTagsRecord
  status: 'loading' | 'complete'
  results: RestaurantOnlyIds[]
  // for not forcing map to be always synced
  searchedCenter?: LngLat
  searchedSpan?: LngLat
  userId?: string
  username?: string
}

export type HomeStateItemRestaurant = HomeStateItemBase & {
  type: 'restaurant'
  restaurantSlug: string
  restaurantId: string | null
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

export type HomeStateItemSimple = Pick<HomeStateItem, 'id' | 'type'>

export type AutocompleteItem = {
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
