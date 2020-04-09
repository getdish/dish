import { isEqual } from '@o/fast-compare'
import _ from 'lodash'
import { Action, AsyncAction, Derive } from 'overmind'
import page from 'page'
import queryString from 'query-string'

import { slugify } from '../helpers/slugify'

class Route<A extends Object | void = void> {
  constructor(public path: string, public params?: A) {}
}

export const routes = {
  home: new Route('/'),
  restaurant: new Route<{ slug: string }>('/restaurant/:slug'),
  user: new Route<{ id: string; pane: string }>('/user/:id/:pane'),
  login: new Route('/login'),
  register: new Route('/register'),
  forgotPassword: new Route('/forgot-password'),
  tag: new Route('/tag'),
  promise: new Route('/promise'),
  pokedex: new Route('/pokedex'),
  account: new Route<{ pane: string }>('/account/:pane'),
  search: new Route<{ [key: string]: string }>('/:lense/:location/:tags?'),
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

  page.start()
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
  prevPage: (state) => state.history[state.history.length - 2],
  curPage: (state) => state.history[state.history.length - 1] || defaultPage,
}

const uid = () => `${Math.random()}`

const navigate: AsyncAction<NavigateItem> = async (om, navItem) => {
  const item: HistoryItem = {
    id: uid(),
    params: {},
    ...navItem,
    path: getPathFromParams({
      name: navItem.name,
      params: navItem.params as any,
    }),
    search: curSearch,
  }

  om.state.router.notFound = false

  const alreadyOnPage = isEqual(
    _.omit(item, 'id', 'replace'),
    _.omit(om.state.router.curPage, 'id', 'replace')
  )
  if (alreadyOnPage) {
    console.log('AlreadyOnPageError', item, om.state.router.curPage)
    return
  }

  if (item.replace) {
    const next = _.dropRight(om.state.router.history)
    om.state.router.history = [...next, item]
  } else {
    om.state.router.history = [...om.state.router.history, item]
  }

  if (item.replace) {
    om.effects.router.replace(item.path)
  } else {
    om.effects.router.open(item.path)
  }

  if (onRouteChange) {
    await onRouteChange({
      type: item.replace ? 'replace' : 'push',
      name: item.name,
      item: _.last(om.state.router.history)!,
    })
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

    console.log('page.js routeListen', {
      url,
      params,
      ignoreNextRoute,
      isGoingBack,
    })

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

      const tmErr = setTimeout(() => {
        throw new Error(`Timed out navigating`)
      }, 1000)

      // go go go
      om.actions.router
        .navigate({
          name,
          params: paramsClean,
        } as any)
        .then(() => {
          clearTimeout(tmErr)
          finishStart()
        })
    }
  })
}

export const actions = {
  start,
  routeListen,
  navigate,
  back,
  forward,
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
  params: Object | void
  convertToSlug?: boolean
}) {
  // object to path
  let route = routes[name]
  if (!route) {
    console.error(`no route`, name, routes)
    return ``
  }
  if (!route.path) {
    console.error(`no route path`, route, name, routes)
    return ``
  }
  let path = route.path
  if (!params) return path
  let replaceSplatParams = []
  for (const key in params) {
    if (path.indexOf(':') > -1) {
      path = path.replace(
        `:${key}`,
        convertToSlug ? slugify(params[key], '-') : params[key]
      )
    } else if (path.indexOf('*') > -1) {
      replaceSplatParams.push(key)
    }
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
