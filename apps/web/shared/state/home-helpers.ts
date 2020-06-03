import { getActiveTags, isSearchBarTag } from './home-tag-helpers'
import {
  HomeStateItem,
  HomeStateItemHome,
  HomeStateItemRestaurant,
  HomeStateItemSearch,
  HomeStateItemUser,
  OmStateHome,
} from './home-types'

type HSIJustType = Pick<HomeStateItem, 'type'>

export const isUserState = (x?: HSIJustType): x is HomeStateItemUser =>
  x?.type === 'user'
export const isSearchState = (x?: HSIJustType): x is HomeStateItemSearch =>
  x?.type === 'search' || x?.type === 'userSearch'
export const isHomeState = (x?: HSIJustType): x is HomeStateItemHome =>
  x?.type === 'home'
export const isRestaurantState = (
  x?: HSIJustType
): x is HomeStateItemRestaurant => x?.type === 'restaurant'

export const shouldBeOnHome = (
  home: OmStateHome,
  state: HomeStateItem = home.states[home.states.length - 1]
) => {
  return (
    state.searchQuery === '' &&
    getActiveTags(home, state).every((tag) => !isSearchBarTag(tag))
  )
}
