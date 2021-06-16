import loadable from '@loadable/component'
import React from 'react'

import {
  isAboutState,
  isHomeState,
  isListState,
  isRestaurantState,
  isSearchState,
  isUserState,
} from '../../helpers/homeStateHelpers'
import HomePage from './HomePage'
import { HomeStackViewPagesContents } from './HomeStackViewPagesContents'
import { HomeStackViewProps } from './HomeStackViewProps'
import { HomeSuspense } from './HomeSuspense'

export const HomeStackViewPages = (props: HomeStackViewProps) => {
  const { item } = props
  return (
    <HomeSuspense>
      {isHomeState(item) && <HomePage {...(props as any)} />}
      {isUserState(item) && <UserPage {...props} />}
      {isSearchState(item) && <SearchPage {...props} />}
      {isRestaurantState(item) && <RestaurantPage {...props} />}
      {isAboutState(item) && <AboutPage {...props} />}
      {isListState(item) && <ListPage {...props} />}
      <HomeStackViewPagesContents {...props} />
    </HomeSuspense>
  )
}

const RestaurantPage =
  process.env.TARGET === 'native' ||
  process.env.TARGET === 'ssr' ||
  process.env.NODE_ENV === 'development'
    ? require('./restaurant/RestaurantPage').default
    : loadable(() => import('./restaurant/RestaurantPage'))

const SearchPage =
  process.env.TARGET === 'native' ||
  process.env.TARGET === 'ssr' ||
  process.env.NODE_ENV === 'development'
    ? require('./search/SearchPage').default
    : loadable(() => import('./search/SearchPage'))

const UserPage =
  process.env.TARGET === 'native' ||
  process.env.TARGET === 'ssr' ||
  process.env.NODE_ENV === 'development'
    ? require('./user/UserPage').default
    : loadable(() => import('./user/UserPage'))

const AboutPage =
  process.env.TARGET === 'native' ||
  process.env.TARGET === 'ssr' ||
  process.env.NODE_ENV === 'development'
    ? require('./about/AboutPage').default
    : loadable(() => import('./about/AboutPage'))

const ListPage =
  process.env.TARGET === 'native' ||
  process.env.TARGET === 'ssr' ||
  process.env.NODE_ENV === 'development'
    ? require('./list/ListPage').default
    : loadable(() => import('./list/ListPage'))