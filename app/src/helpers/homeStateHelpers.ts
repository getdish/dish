import {
  HomeStateItem,
  HomeStateItemAbout,
  HomeStateItemBlog,
  HomeStateItemHome,
  HomeStateItemList,
  HomeStateItemRestaurant,
  HomeStateItemRoadmap,
  HomeStateItemSearch,
  HomeStateItemUser,
} from '../types/homeTypes'

type HSIJustType = Pick<HomeStateItem, 'type'>

export const isBlogState = (x?: HSIJustType): x is HomeStateItemBlog => x?.type === 'blog'
export const isUserState = (x?: HSIJustType): x is HomeStateItemUser => x?.type === 'user'
export const isAboutState = (x?: HSIJustType): x is HomeStateItemAbout => x?.type === 'about'
export const isSearchState = (x?: HSIJustType): x is HomeStateItemSearch => x?.type === 'search'
export const isHomeState = (x?: HSIJustType): x is HomeStateItemHome =>
  x?.type === 'home' || x?.type === 'homeRegion'
export const isListState = (x?: HSIJustType): x is HomeStateItemList => x?.type === 'list'
export const isRoadmapState = (x?: HSIJustType): x is HomeStateItemRoadmap => x?.type === 'roadmap'
export const isAccountState = (x?: HSIJustType): x is HomeStateItemList => x?.type === 'account'
export const isRestaurantState = (x?: HSIJustType): x is HomeStateItemRestaurant =>
  x?.type === 'restaurant'
