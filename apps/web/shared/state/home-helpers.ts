import { getActiveTags, isSearchBarTag } from './home-tag-helpers'
import {
  HomeStateItem,
  HomeStateItemAbout,
  HomeStateItemHome,
  HomeStateItemRestaurant,
  HomeStateItemSearch,
  HomeStateItemUser,
  HomeStateTagNavigable,
} from './home-types'
import { omStatic } from './useOvermind'

type HSIJustType = Pick<HomeStateItem, 'type'>

export const isUserState = (x?: HSIJustType): x is HomeStateItemUser =>
  x?.type === 'user'
export const isAboutState = (x?: HSIJustType): x is HomeStateItemAbout =>
  x?.type === 'about'
export const isSearchState = (x?: HSIJustType): x is HomeStateItemSearch =>
  x?.type === 'search' || x?.type === 'userSearch'
export const isHomeState = (x?: HSIJustType): x is HomeStateItemHome =>
  x?.type === 'home'
export const isRestaurantState = (
  x?: HSIJustType
): x is HomeStateItemRestaurant => x?.type === 'restaurant'

export const shouldBeOnHome = (state: HomeStateTagNavigable) => {
  const realState =
    state ?? omStatic.state.home.states[omStatic.state.home.states.length - 1]
  return (
    realState.searchQuery === '' &&
    getActiveTags(realState).every((tag) => !isSearchBarTag(tag))
  )
}
