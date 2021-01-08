import { HistoryType, Route, Router } from '@dish/router'
import { createStore, useStoreInstance } from '@dish/use-store'

export type RoutesTable = typeof routes
export type RouteName = keyof RoutesTable

export const routes = {
  // order important
  home: new Route('/'),

  // all pages go here
  user: new Route<{ username: string; pane?: string }>('/u/:username/:pane?'),
  userEdit: new Route<{ username: string; pane?: string }>('/edit-profile'),
  gallery: new Route<{ restaurantSlug: string; dishId?: string }>(
    '/gallery/:restaurantSlug/:dishId?'
  ),

  login: new Route('/login'),
  register: new Route('/register'),
  forgotPassword: new Route('/forgotten-password'),
  passwordReset: new Route<{ token: string }>('/password-reset/:token'),
  tag: new Route('/tag'),
  promise: new Route('/promise'),
  pokedex: new Route('/pokedex'),
  contact: new Route<{ pane: string }>('/contact'),
  privacy: new Route<{ pane: string }>('/privacy'),
  about: new Route<{ pane: string }>('/about'),
  blog: new Route<{ pane: string }>('/blog/:slug?'),
  restaurantReview: new Route<{ slug: string }>('/restaurant/:slug/review'),
  restaurantHours: new Route<{ slug: string }>('/restaurant/:slug/hours'),
  restaurant: new Route<{
    slug: string
    section?: 'reviews'
    sectionSlug?: string
  }>('/restaurant/:slug/:section?/:sectionSlug?'),

  // admin
  admin: new Route('/admin'),
  adminTags: new Route('/admin/tags'),
  adminReviews: new Route('/admin/reviews'),
  adminUsers: new Route('/admin/users'),

  // below pages, more catch-all routes (search)
  // NOTE keep userSearch and search in sync
  // after user/restaurant
  userSearch: new Route<SearchRouteParams>(
    '/u/:username/:lense/:region/:tags?/:search?'
  ),
  // search after userSearch
  search: new Route<SearchRouteParams>('/s/:lense/:region/:tags?/:search?'),

  homeRegion: new Route<{ region?: string; section?: 'new' }>(
    '/:region?/:section?'
  ),

  notFound: new Route('*'),
}

export const router = createStore(Router, { routes })

export const useRouter = () => {
  return useStoreInstance(router)
}

export const useRouterCurPage = () => {
  return useStoreInstance(router, (router) => router.curPage)
}

export const useIsRouteActive = (name: RouteName) => {
  return useStoreInstance(router, (router) => router.curPage.name === name)
}

export type SearchRouteParams = {
  username?: string
  region: string
  lense: string
  search?: string
  tags?: string
}

export const routeNames = Object.keys(routes) as RouteName[]
export const routePathToName: {
  [key in RouteName]: string
} = Object.keys(routes).reduce((acc, key) => {
  acc[routes[key].path] = key
  return acc
}, {}) as any
