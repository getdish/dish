import { slugify } from '@dish/graph'
import { isEqual } from '@o/fast-compare'
import _ from 'lodash'
import { Action, AsyncAction, Derive, derived } from 'overmind'
import page from 'page'
import queryString from 'query-string'

import { race } from '../helpers/race'

export type HistoryItem<A extends RouteName = any> = {
  id: string
  name: A
  path: string
  type?: 'push' | 'pop'
  search?: Object
  params?: RoutesTable[A]['params']
  replace?: boolean
}

export type RouterState = {
  notFound: boolean
  history: HistoryItem[]
  prevPage: HistoryItem | undefined
  curPage: HistoryItem
}

// we could enable functionality like this
export type LoadableView = React.SFC & {
  fetchData: (params: HistoryItem) => Promise<any>
}

export type PageRouteView = LoadableView | Promise<LoadableView>

export class Route<A extends Object | void = void> {
  constructor(
    public path: string,
    public page?: PageRouteView,
    public params?: A
  ) {}
}

export type SearchRouteParams = {
  username?: string
  location: string
  lense: string
  search?: string
  tags?: string
}

export const routes = {
  home: new Route('/'),
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

export type NavigateItem<
  T = {
    [K in keyof RoutesTable]: {
      name: K
      params?: RoutesTable[K]['params']
    }
  }
> = T[keyof T] & {
  search?: Object
  replace?: boolean
  callback?: OnRouteChangeCb
}

let ignoreNextRoute = false

export type RouteItem = {
  type: 'push' | 'pop' | 'replace'
  name: RouteName
  item: HistoryItem
}
export type OnRouteChangeCb = (item: RouteItem) => Promise<void>

let onRouteChange: OnRouteChangeCb | null = null
let finishStart: Function
let onFinishStart = new Promise((res) => {
  finishStart = res
})

const start: AsyncAction<{
  onRouteChange?: OnRouteChangeCb
}> = async (om, opts) => {
  onRouteChange = opts.onRouteChange ?? null

  for (const name of routeNames) {
    om.actions.router.routeListen({
      name,
      url: routes[name].path,
    })
  }

  page.start({
    click: false,
  })

  await onFinishStart
}

// state

const defaultPage = {
  id: '0',
  name: 'home',
  path: '/',
  params: {},
}

export const state: RouterState = {
  notFound: false,
  history: [],
  prevPage: derived<RouterState, HistoryItem | undefined>(
    (state) => state.history[state.history.length - 2]
  ),
  curPage: derived<RouterState, HistoryItem>(
    (state) => state.history[state.history.length - 1] || defaultPage
  ),
}

const uid = () => `${Math.random()}`

const navItemToHistoryItem = (navItem: NavigateItem): HistoryItem => {
  const params = {}

  // remove undefined params
  if ('params' in navItem && !!navItem.params) {
    for (const key in navItem.params) {
      const value = navItem.params[key]
      if (typeof value !== 'undefined') {
        params[key] = value
      }
    }
  }

  return {
    id: uid(),
    ...navItem,
    type: 'push',
    params,
    path: getPathFromParams({
      name: navItem.name,
      params,
    }),
    search: curSearch,
  }
}

const getShouldNavigate: Action<NavigateItem, boolean> = (om, navItem) => {
  const historyItem = navItemToHistoryItem(navItem)
  return !isEqual(
    _.omit(historyItem, 'id', 'replace'),
    _.omit(om.state.router.curPage, 'id', 'replace')
  )
}

const navigate: AsyncAction<NavigateItem> = async (om, navItem) => {
  const item = navItemToHistoryItem(navItem)

  if (om.state.router.notFound) {
    om.state.router.notFound = false
  }

  if (!getShouldNavigate(om, navItem)) {
    console.log('already on page')
    return
  }

  if (item.replace) {
    const next = _.dropRight(om.state.router.history)
    om.state.router.history = [...next, item]
    om.effects.router.replace(item.path)
  } else {
    om.state.router.history = [...om.state.router.history, item]
    om.effects.router.open(item.path)
  }

  if (onRouteChange) {
    await race(
      onRouteChange({
        type: item.replace ? 'replace' : 'push',
        name: item.name,
        item: _.last(om.state.router.history)!,
      }),
      2000,
      'router.onRouteChange',
      {
        warnOnly: true,
      }
    )
  }
}

const back: Action = (om) => {
  window.history.back()
}

const forward: Action = (om) => {
  window.history.forward()
}

let curSearch = {}

let pop: { path: string; at: number } | null = null
window.addEventListener('popstate', (event) => {
  pop = {
    path: event.state.path,
    at: Date.now(),
  }
})

const routeListen: Action<{
  url: string
  name: RouteName
}> = (om, { name, url }) => {
  page(url, async ({ params, querystring }) => {
    let isGoingBack = false
    if (pop && Date.now() - pop.at < 30) {
      if (pop.path == getPathFromParams({ name, params })) {
        const history = om.state.router.history
        const last = history[history.length - 2] ?? history[history.length - 1]
        const lastPath = last.path
        const lastMatches = lastPath == pop.path
        isGoingBack = lastMatches
      }
    }

    if (!ignoreNextRoute) {
      console.log('page.js routing', {
        url,
        params,
        isGoingBack,
      })
    }

    curSearch = queryString.parse(querystring)

    if (isGoingBack) {
      const last = _.last(om.state.router.history)
      if (last && onRouteChange) {
        onRouteChange({ type: 'pop', name, item: last })
      }
    } else {
      if (ignoreNextRoute) {
        ignoreNextRoute = false
        return
      }
      const paramsClean = Object.keys(params).reduce((acc, cur) => {
        if (params[cur]) {
          acc[cur] = params[cur]
        }
        return acc
      }, {})

      const args: NavigateItem = {
        name,
        params: paramsClean,
      } as any

      // go go go
      await race(om.actions.router.navigate(args), 2000, 'router.navigate', {
        warnOnly: true,
      })

      finishStart()
    }
  })
}

export const actions = {
  start,
  routeListen,
  navigate,
  back,
  forward,
  getShouldNavigate,
}

// effects

export const effects = {
  open(url: string) {
    ignoreNextRoute = true
    page.show(url)
  },

  replace(url: string) {
    ignoreNextRoute = true
    page.replace(url)
  },
}

export function getPathFromParams({
  name,
  params,
  convertToSlug,
}: {
  name: string
  params?: Object | void
  convertToSlug?: boolean
}) {
  // object to path
  let route = routes[name]
  if (!route) {
    console.debug(`no route`, name, routes)
    return ``
  }
  if (!route.path) {
    console.debug(`no route path`, route, name, routes)
    return ``
  }
  let path = route.path
  if (!params) return path
  let replaceSplatParams: string[] = []
  for (const key in params) {
    if (typeof params[key] === 'undefined') {
      continue
    }
    if (path.indexOf(':') > -1) {
      path = path.replace(
        `:${key}`,
        convertToSlug ? slugify(params[key], '-') : params[key]
      )
    } else if (path.indexOf('*') > -1) {
      replaceSplatParams.push(key)
    }
  }

  // remove unused optionals optionals
  if (path.indexOf('/:') > 0) {
    path = path.replace(/\/:[a-zA-Z-_]+\??/gi, '')
  }

  if (replaceSplatParams.length) {
    path = path.replace(
      '*',
      replaceSplatParams.map((key) => `${key}/${params[key]}`).join('/')
    )
  }

  // remove extra stuffs
  path = path.replace(/\?/g, '')
  path = path.replace(/(\/\:[^\/]+)/g, '')

  return path
}
