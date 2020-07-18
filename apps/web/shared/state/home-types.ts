import { RestaurantOnlyIds, Tag, TopCuisine, User } from '@dish/graph'
import { NavigateItem } from '@dish/router'
import { Config, IContext } from 'overmind'

import { NavigableTag } from './Tag'

export type Om = IContext<Config>
export type OmState = Om['state']
export type OmStateHome = OmState['home']

export type HomeState = {
  isOptimisticUpdating: boolean
  isScrolling: boolean
  started: boolean
  activeIndex: number // index for vertical (in page), -1 = autocomplete
  allUsers: { [id: string]: User }
  allTags: { [keyPath: string]: Tag }
  allTagsNameToID: { [name: string]: string }
  allLenseTags: Tag[]
  allFilterTags: Tag[]
  autocompleteIndex: number // index for horizontal row (autocomplete)
  autocompleteResults: AutocompleteItem[]
  hoveredRestaurant: RestaurantOnlyIds | null
  location: AutocompleteItem | null // for now just autocomplete item
  locationAutocompleteResults: AutocompleteItem[]
  locationSearchQuery: string
  showAutocomplete: ShowAutocomplete
  showUserMenu: boolean
  states: HomeStateItem[]
  allStates: { [key: string]: HomeStateItem }
  stateIndex: number
  stateIds: string[]
  topDishes: TopCuisine[]
  topDishesFilteredIndices: number[]
  skipNextPageFetchData: boolean
  lastHomeState: HomeStateItemHome
  lastSearchState: HomeStateItemSearch | undefined
  lastRestaurantState: HomeStateItemRestaurant | undefined
  currentNavItem: NavigateItem
  currentState: HomeStateItem
  currentStateType: HomeStateItem['type']
  currentStateSearchQuery: HomeStateItem['searchQuery']
  previousState: HomeStateItem
  isAutocompleteActive: boolean
  isLoading: boolean
  currentStateLense: NavigableTag | null
  lastActiveTags: Tag[]
  searchbarFocusedTag: Tag | null
  searchBarTagIndex: number
  searchBarTags: Tag[]
  userLocation: LngLat | null
}

export type GeocodePlace = mapkit.Place & {
  locality: string
  administrativeArea: string
  countryCode: string
  country: string
  timezone: string
  dependentLocalities: string[]
  subLocality: string
}

export type ShowAutocomplete = 'search' | 'location' | false

type SearchResultsResults = {
  restaurants: { id: string; slug: string }[]
  dishes: string[]
  locations: string[]
}

export type SearchResults =
  | { status: 'loading'; results?: SearchResultsResults }
  | {
      status: 'complete'
      results: SearchResultsResults
    }

export type LngLat = { lng: number; lat: number }

export type HomeStateItemBase = {
  searchQuery: string
  center: LngLat
  span: LngLat
  id: string
  historyId?: string
  currentLocationName?: string
  currentLocationInfo?: GeocodePlace | null
}

export type HomeStateItem =
  | HomeStateItemHome
  | HomeStateItemSearch
  | HomeStateItemRestaurant
  | HomeStateItemUser
  | HomeStateItemGallery
  | HomeStateTagNavigable

export type HomeStateTagNavigable = Pick<
  HomeStateItemSearch,
  'id' | 'type' | 'activeTagIds' | 'searchQuery'
> &
  Partial<Omit<HomeStateItemSearch, 'type'>>

export type HomeActiveTagIds = { [id: string]: boolean }

export type HomeStateItemHome = HomeStateItemBase & {
  type: 'home'
  activeTagIds: HomeActiveTagIds
}

export type HomeStateItemSearch = HomeStateItemBase & {
  type: 'search' | 'userSearch'
  activeTagIds: HomeActiveTagIds
  results: SearchResults
  // for not forcing map to be always synced
  searchedCenter?: LngLat
  searchedSpan?: LngLat
  userId?: string
  username?: string
  hasMovedMap: boolean
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
}
