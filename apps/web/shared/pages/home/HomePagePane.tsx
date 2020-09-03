import loadable from '@loadable/component'
import React, { Suspense } from 'react'

import {
  isAboutState,
  isHomeState,
  isRestaurantState,
  isSearchState,
  isUserState,
} from '../../state/home-helpers'
import { HomePagePaneProps } from './HomePagePaneProps'

export const HomePagePane = (props: HomePagePaneProps) => {
  const { item } = props
  return (
    <Suspense fallback={null}>
      {isHomeState(item) && <HomePageHomePane {...props} />}
      {isUserState(item) && <HomePageUser {...props} />}
      {isSearchState(item) && <HomePageSearchResults {...props} />}
      {isRestaurantState(item) && <HomePageRestaurant {...props} />}
      {isAboutState(item) && <HomePageAbout {...props} />}
    </Suspense>
  )
}

const HomePageAbout =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageAbout').default
    : loadable(() => import('./HomePageAbout'))

const HomePageRestaurant =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageRestaurant').default
    : loadable(() => import('./HomePageRestaurant'))

const HomePageSearchResults =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageSearchResults').default
    : loadable(() => import('./HomePageSearchResults'))

const HomePageHomePane =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageHomePane').default
    : loadable(() => import('./HomePageHomePane'))

const HomePageUser =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageUser').default
    : loadable(() => import('./HomePageUser'))
