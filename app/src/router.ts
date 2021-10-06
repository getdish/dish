import { HistoryItem, NavigateItem as RNavigateItem, Route, Router } from '@dish/router'
import { createStore, useStoreInstance, useStoreInstanceSelector } from '@dish/use-store'

export type DRoutesTable = typeof routes
export type DRouteName = keyof DRoutesTable
export type NavigateItem = RNavigateItem<DRoutesTable>

export const routes = {
  // order important
  home: new Route('/'),

  // all pages go here
  user: new Route<{ username: string; pane?: string }>('/u/:username/:pane?'),
  userEdit: new Route('/edit-profile'),
  gallery: new Route<{
    restaurantSlug: string
    // tagSlug?: string
    offset?: number
  }>('/gallery/:restaurantSlug/:offset?'),

  list: new Route<{
    slug: string
    userSlug: string
    state?: 'edit' | string
  }>('/l/:userSlug/:slug/:state?'),
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
  blog: new Route<{ slug: string }>('/blog/:slug?'),
  account: new Route('/account'),
  roadmap: new Route('/roadmap'),
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
  adminPlaces: new Route('/admin/places'),
  adminUsers: new Route('/admin/users'),
  search: new Route<SearchRouteParams>('/s/:lense/:region/:tags?/:search?'),

  // home region is catch-all, goes near end
  homeRegion: new Route<{ region?: string; section?: 'new' }>('/:region?/:section?'),

  notFound: new Route('*'),
}

export const router = createStore(Router, { routes })

global['router'] = router

export const useRouter = () => {
  return useStoreInstance(router)
}

export const useRouterCurPage = () => {
  return useStoreInstanceSelector(router, (router) => router.curPage)
}

export const useIsRouteActive = (...names: DRouteName[]) => {
  return useStoreInstanceSelector(router, (router) => names.includes(router.curPage.name as any))
}

export const useRoute = <N extends DRouteName>(name: N): HistoryItem<N> => {
  return useStoreInstanceSelector(
    router,
    (router) => (router.curPage.name === name ? router.curPage : null) as HistoryItem<N>
  )
}

export type SearchRouteParams = {
  username?: string
  region: string
  lense: string
  search?: string
  tags?: string
}

export const routeNames = Object.keys(routes) as DRouteName[]
export const routePathToName: {
  [key in DRouteName]: string
} = Object.keys(routes).reduce((acc, key) => {
  acc[routes[key].path] = key
  return acc
}, {}) as any
