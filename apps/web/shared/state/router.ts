import { isEqual } from '@o/fast-compare'
import {
  Action,
  AsyncAction,
  catchError,
  Derive,
  mutate,
  Operator,
  pipe,
  run,
  map,
} from 'overmind'
import page from 'page'
import queryString from 'query-string'
import _ from 'lodash'
import { slugify } from '../helpers/slugify'

class Route<A extends Object | void = void> {
  params: A
  constructor(public path: string) {}
}

export const routes = {
  home: new Route('/'),
  login: new Route('/login'),
  register: new Route('/register'),
  forgotPassword: new Route('/forgot-password'),
  taxonomy: new Route('/taxonomy'),
  account: new Route<{ pane: string }>('/account/:pane'),
  search: new Route<{ query: string }>('/search/:query'),
  restaurant: new Route<{ slug: string }>('/restaurant/:slug'),
  user: new Route<{ id: string; pane: string }>('/user/:id/:pane'),
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

export type HistoryItem<A extends RouteName = any> = {
  id: string
  name: A
  path: string
  type?: 'push' | 'pop'
  search?: Object
  params?: RoutesTable[A]
  replace?: boolean
}

export type RouterState = {
  notFound: boolean
  history: HistoryItem[]
  prevPage: Derive<RouterState, HistoryItem | undefined>
  curPage: Derive<RouterState, HistoryItem>
}

let ignoreNextRoute = false

export type OnRouteChangeCb = (item: {
  type: 'push' | 'pop' | 'replace'
  name: RouteName
  item: HistoryItem
}) => any

let onRouteChange: OnRouteChangeCb | null = null

const start: AsyncAction<{
  onRouteChange?: OnRouteChangeCb
}> = async (om, opts) => {
  onRouteChange = opts.onRouteChange

  for (const name of routeNames) {
    om.actions.router.routeListen({
      name,
      url: routes[name].path,
    })
  }
  om.actions.router.routeListenNotFound()
  page.start()
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
  prevPage: (state) => state.history[state.history.length - 2],
  curPage: (state) => state.history[state.history.length - 1] || defaultPage,
}

class AlreadyOnPageError extends Error {}
const uid = () => `${Math.random()}`

const navigate: Operator<NavigateItem> = pipe(
  map(
    (_, item): HistoryItem => {
      // console.log('navigate', item)
      return {
        id: uid(),
        params: {},
        ...item,
        path: getPathFromParams({
          name: item.name,
          params: item.params as any,
        }),
        search: curSearch,
      }
    }
  ),
  mutate((om, item) => {
    om.state.router.notFound = false

    const alreadyOnPage = isEqual(
      _.omit(item, 'id', 'replace'),
      _.omit(om.state.router.curPage, 'id', 'replace')
    )
    if (alreadyOnPage) {
      console.log('AlreadyOnPageError', item, om.state.router.curPage)
      throw new AlreadyOnPageError()
    }

    // const isGoingBack = isEqual(
    //   _.omit(om.state.router.prevPage, 'id', 'replace'),
    //   _.omit(item, 'id', 'replace')
    // )
    // console.warn('isgoingback', isGoingBack, item, om.state.router.prevPage)
    // if (isGoingBack) {
    //   om.actions.router.back()
    //   throw new AlreadyOnPageError()
    // }

    if (item.replace) {
      const next = _.dropRight(om.state.router.history)
      om.state.router.history = [...next, item]
    } else {
      om.state.router.history = [...om.state.router.history, item]
    }
  }),
  run((om, item) => {
    if (onRouteChange) {
      onRouteChange({
        type: item.replace ? 'replace' : 'push',
        name: item.name,
        item: _.last(om.state.router.history),
      })
    }
    if (item.replace) {
      om.effects.router.replace(item.path)
    } else {
      om.effects.router.open(item.path)
    }
  }),
  mutate((om) => {
    //
  }),
  catchError<void>((om, error) => {
    if (error instanceof AlreadyOnPageError) {
      // ok
    } else {
      console.error(error)
    }
  })
)

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
  page(url, ({ params, querystring }) => {
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

    console.log('page', url, params, { ignoreNextRoute, isGoingBack })
    curSearch = queryString.parse(querystring)

    if (isGoingBack) {
      const last = _.last(om.state.router.history)
      if (onRouteChange) {
        onRouteChange({ type: 'pop', name, item: last })
      }
    } else {
      if (ignoreNextRoute) {
        ignoreNextRoute = false
        return
      }
      const paramsClean = { ...params }
      om.actions.router.navigate({
        name,
        params: paramsClean,
      })
    }
  })
}

const routeListenNotFound: Action = (om) => {
  page('*', (ctx) => {
    console.log('Not found!', ctx)
    om.state.router.notFound = true
  })
}

export const actions = {
  start,
  routeListenNotFound,
  routeListen,
  navigate,
  back,
  forward,
}

// effects

export const effects = {
  open(url: string) {
    console.log('open()', url)
    ignoreNextRoute = true
    page.show(url)
  },

  replace(url: string) {
    console.log('replace()', url)
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
  params: Object | void
  convertToSlug?: boolean
}) {
  // object to path
  let route = routes[name]
  if (!route) {
    debugger
    console.error(`no route`, name, routes)
    return ``
  }
  if (!route.path) {
    debugger
    console.error(`no route path`, route, name, routes)
    return ``
  }
  let path = route.path
  if (!params) return path
  for (const key in params) {
    path = path.replace(
      `:${key}`,
      convertToSlug ? slugify(params[key], '-') : params[key]
    )
  }
  return path
}
