import React, { Suspense } from 'react'

import { HomeStateItem } from '../../state/home'
import {
  isHomeState,
  isRestaurantState,
  isSearchState,
  isUserState,
} from '../../state/home-helpers'
import { StackItemProps } from './HomeStackView'

export type HomePagePaneProps<
  A extends HomeStateItem = HomeStateItem
> = StackItemProps<A>

export const HomePagePane = (props: HomePagePaneProps) => {
  const { item } = props
  return (
    <Suspense fallback={null}>
      {isHomeState(item) && <HomePageHomePane {...props} />}
      {isUserState(item) && <HomePageUser {...props} />}
      {isSearchState(item) && <HomePageSearchResults {...props} />}
      {isRestaurantState(item) && <HomePageRestaurant {...props} />}
    </Suspense>
  )
}

const HomePageRestaurant =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageRestaurant').default
    : React.lazy(() => import('./HomePageRestaurant'))

const HomePageSearchResults =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageSearchResults').default
    : React.lazy(() => import('./HomePageSearchResults'))

const HomePageHomePane =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageHomePane').default
    : React.lazy(() => import('./HomePageHomePane'))

const HomePageUser =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageUser').default
    : React.lazy(() => import('./HomePageUser'))
