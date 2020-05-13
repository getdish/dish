import { Restaurant, Review, User } from '@dish/graph'
import { TopCuisine } from '@dish/models'
import { Config, IContext, derived } from 'overmind'

import { NavigateItem } from './router'
import { Tag } from './Tag'

export type Om = IContext<Config>
export type OmState = Om['state']
export type OmStateHome = OmState['home']

export type HomeState = {
  started: boolean
  activeIndex: number // index for vertical (in page), -1 = autocomplete
  allUsers: { [id: string]: User }
  allTags: { [keyPath: string]: Tag }
  allLenseTags: Tag[]
  allFilterTags: Tag[]
  allRestaurants: { [id: string]: Restaurant }
  autocompleteDishes: TopCuisine['dishes']
  autocompleteIndex: number // index for horizontal row (autocomplete)
  autocompleteResults: AutocompleteItem[]
  hoveredRestaurant: Restaurant | null
  location: AutocompleteItem | null // for now just autocomplete item
  locationAutocompleteResults: AutocompleteItem[]
  locationSearchQuery: string
  showAutocomplete: ShowAutocomplete
  showUserMenu: boolean
  states: HomeStateItem[]
  topDishes: TopCuisine[]
  topDishesFilteredIndices: number[]
  skipNextPageFetchData: boolean
  breadcrumbStates: HomeStateItemSimple[]
  lastHomeState: HomeStateItemHome
  lastSearchState: HomeStateItemSearch | null
  lastRestaurantState: HomeStateItemRestaurant | null
  currentNavItem: NavigateItem
  currentState: HomeStateItem
  currentStateType: HomeStateItem['type']
  currentStateSearchQuery: HomeStateItem['searchQuery']
  previousState: HomeStateItem
  isAutocompleteActive: boolean
  isLoading: boolean
  autocompleteResultsActive: AutocompleteItem[]
  lastActiveTags: Tag[]
  searchbarFocusedTag: Tag
  autocompleteFocusedTag: Tag
  searchBarTags: Tag[]
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
  restaurantIds: string[]
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

type HomeStateItemBase = {
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

export type HomeStateItemSimple = Pick<HomeStateItem, 'id' | 'type'>

export type AutocompleteItem = {
  icon?: string
  name: string
  tagId: string
  type: Tag['type']
  center?: LngLat
}
