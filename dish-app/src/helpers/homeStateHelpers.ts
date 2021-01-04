import {
  HomeStateItem,
  HomeStateItemAbout,
  HomeStateItemBlog,
  HomeStateItemHome,
  HomeStateItemRestaurant,
  HomeStateItemSearch,
  HomeStateItemUser,
} from '../types/homeTypes'

type HSIJustType = Pick<HomeStateItem, 'type'>

export const isBlogState = (x?: HSIJustType): x is HomeStateItemBlog =>
  x?.type === 'blog'
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
