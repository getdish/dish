import loadable from '@loadable/component'
import React, { Suspense } from 'react'

import {
  isAboutState,
  isHomeState,
  isRestaurantState,
  isSearchState,
  isUserState,
} from '../state/home-helpers'
import { PagesWebPanes } from './PagesWebPanes'
import { StackViewProps } from './StackViewProps'

export const PagesStackView = (props: StackViewProps) => {
  const { item } = props
  return (
    <Suspense fallback={null}>
      {isHomeState(item) && <HomePage {...props} />}
      {isUserState(item) && <UserPage {...props} />}
      {isSearchState(item) && <SearchPage {...props} />}
      {isRestaurantState(item) && <RestaurantPage {...props} />}
      {isAboutState(item) && <AboutPage {...props} />}
      <PagesWebPanes {...props} />
    </Suspense>
  )
}

const RestaurantPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./restaurant/RestaurantPage').default
    : loadable(() => import('./restaurant/RestaurantPage'))

const SearchPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./search/SearchPage').default
    : loadable(() => import('./search/SearchPage'))

const HomePage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./home/HomePage').default
    : loadable(() => import('./home/HomePage'))

const UserPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./user/UserPage').default
    : loadable(() => import('./user/UserPage'))

const AboutPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./about/AboutPage').default
    : loadable(() => import('./about/AboutPage'))
