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
import { HomeStackViewPagesContents } from './HomeStackViewPagesContents'
import { HomeStackViewProps } from './HomeStackViewProps'
import { HomeSuspense } from './HomeSuspense'

export const HomeStackViewPages = (props: HomeStackViewProps) => {
  const { item } = props

  console.log('SearchPage', SearchPage)

  return (
    <HomeSuspense>
      {isHomeState(item) && <HomePage {...props} />}
      {isUserState(item) && <UserPage {...props} />}
      {isSearchState(item) && <SearchPage {...props} />}
      {isRestaurantState(item) && <RestaurantPage {...props} />}
      {isAboutState(item) && <AboutPage {...props} />}
      {isListState(item) && <ListPage {...props} />}
      <HomeStackViewPagesContents {...props} />
    </HomeSuspense>
  )
}

const isntLoadable =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'

const RestaurantPage = isntLoadable
  ? require('./restaurant/RestaurantPage').default
  : loadable(() => import('./restaurant/RestaurantPage'))

const SearchPage = isntLoadable
  ? require('./search/SearchPage').default
  : loadable(() => import('./search/SearchPage'))

const HomePage = isntLoadable
  ? require('./HomePage').default
  : loadable(() => import('./HomePage'))

const UserPage = isntLoadable
  ? require('./user/UserPage').default
  : loadable(() => import('./user/UserPage'))

const AboutPage = isntLoadable
  ? require('./about/AboutPage').default
  : loadable(() => import('./about/AboutPage'))

const ListPage = isntLoadable
  ? require('./list/ListPage').default
  : loadable(() => import('./list/ListPage'))
