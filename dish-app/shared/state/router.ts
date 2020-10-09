import { HistoryItem, Route, Router } from '@dish/router'
import { Action, AsyncAction, derived } from 'overmind'

import { OmState } from './home-types'

export type SearchRouteParams = {
  username?: string
  location: string
  lense: string
  search?: string
  tags?: string
}

export const routes = {
  home: new Route('/'),

  // all pages go here
  user: new Route<{ username: string; pane?: string }>('/u/:username/:pane?'),
  userEdit: new Route<{ username: string; pane?: string }>('/edit-profile'),
  gallery: new Route<{ restaurantSlug: string; dishId?: string }>(
    '/gallery/:restaurantSlug/:dishId?'
  ),

  login: new Route('/login'),
  register: new Route('/register'),
  forgotPassword: new Route('/forgot-password'),
  tag: new Route('/tag'),
  promise: new Route('/promise'),
  pokedex: new Route('/pokedex'),
  account: new Route<{ pane: string }>('/account/:pane'),
  contact: new Route<{ pane: string }>('/contact'),
  privacy: new Route<{ pane: string }>('/privacy'),
  about: new Route<{ pane: string }>('/about'),
  blog: new Route<{ pane: string }>('/blog/:slug?'),
  restaurantReview: new Route<{ slug: string }>('/restaurant/:slug/review'),
  restaurantReviews: new Route<{ slug: string }>(
    '/restaurant/:slug/:id/reviews'
  ),
  restaurantHours: new Route<{ slug: string }>('/restaurant/:slug/hours'),
  restaurant: new Route<{ slug: string }>('/restaurant/:slug'),

  // admin
  admin: new Route('/admin'),
  adminTags: new Route('/admin/tags'),
  adminReviews: new Route('/admin/reviews'),
  adminUsers: new Route('/admin/users'),

  // below pages, more catch-all routes (search)

  // NOTE keep userSearch and search in sync
  // after user/restaurant
  userSearch: new Route<SearchRouteParams>(
    '/u/:username/:lense/:location/:tags?/:search?'
  ),
  // search after userSearch
  search: new Route<SearchRouteParams>('/:lense/:location/:tags?/:search?'),

  notFound: new Route('*'),
}

export const routeNames = Object.keys(routes) as RouteName[]
export const routePathToName: { [key in RouteName]: string } = Object.keys(
  routes
).reduce((acc, key) => {
  acc[routes[key].path] = key
  return acc
}, {}) as any

export type RoutesTable = typeof routes
export type RouteName = keyof RoutesTable

export const router = new Router({
  // @ts-ignore
  routes,
})

export type OnRouteChangeCb = (item: HistoryItem) => Promise<void>

const start: Action = (om) => {
  router.onRouteChange((item) => {
    om.actions.router._update()
    om.actions.home.handleRouteChange(item)
  })
  router.mount()
}

type RouterState = {
  _update: number
  curPage: HistoryItem
  curPageName: string
}

export const state: RouterState = {
  _update: 0,
  curPage: derived<RouterState, OmState, HistoryItem>((state) => {
    state._update
    return router.curPage
  }),
  curPageName: derived<RouterState, OmState, string>((state) => {
    state._update
    return state.curPage.name
  }),
}

const _update: Action = (om) => {
  om.state.router._update += 1
}

export const actions = {
  start,
  _update,
}
