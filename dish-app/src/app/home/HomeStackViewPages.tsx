import loadable from '@loadable/component'
import React, { Suspense, useEffect, useLayoutEffect } from 'react'

import {
  isAboutState,
  isHomeState,
  isRestaurantState,
  isSearchState,
  isUserState,
} from '../state/home-helpers'
import { HomeStackViewPagesContents } from './HomeStackViewPagesContents'
import { HomeStackViewProps } from './HomeStackViewProps'
import { homeStore } from './HomeStore'

export const HomeStackViewPages = (props: HomeStackViewProps) => {
  const { item } = props
  return (
    <HomeSuspense>
      {isHomeState(item) && <HomePage {...props} />}
      {isUserState(item) && <UserPage {...props} />}
      {isSearchState(item) && <SearchPage {...props} />}
      {isRestaurantState(item) && <RestaurantPage {...props} />}
      {isAboutState(item) && <AboutPage {...props} />}
      <HomeStackViewPagesContents {...props} />
    </HomeSuspense>
  )
}

export function HomeSuspense(props: { children: any; fallback?: any }) {
  return (
    <Suspense fallback={<PageLoading fallback={props.fallback} />}>
      {props.children}
    </Suspense>
  )
}

function PageLoading({ fallback }: { fallback?: any }) {
  useEffect(() => {
    homeStore.setLoading(true)
    return () => {
      homeStore.setLoading(false)
    }
  }, [])

  return fallback ?? null
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
