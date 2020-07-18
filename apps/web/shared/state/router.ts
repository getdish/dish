import { HistoryItem, NavigateItem, Route, Router } from '@dish/router'
import { Action, AsyncAction, derived } from 'overmind'

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
  restaurant: new Route<{ slug: string }>('/restaurant/:slug'),

  // admin
  admin: new Route('/admin'),
  adminTags: new Route('/admin/tags'),

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

const start: AsyncAction<{
  onRouteChange?: OnRouteChangeCb
}> = async (om, opts) => {
  router.onRouteChange((item) => {
    console.log('getem', item)
    om.actions.router._update()
    opts.onRouteChange?.(item)
  })
}

type RouterState = {
  _update: number
  curPage: HistoryItem
}

export const state: RouterState = {
  _update: 0,
  curPage: derived<RouterState, HistoryItem>((state) => {
    state._update
    return router.curPage
  }),
}

const _update: Action = (om) => {
  om.state.router._update += 1
}

export const actions = {
  start,
  _update,
}
