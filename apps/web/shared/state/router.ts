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

class Route<A extends Object | void = void> {
  params: A
  constructor(public path: string) {}
}

export const routes = {
  home: new Route('/'),
  login: new Route('/login'),
  register: new Route('/register'),
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
  A extends keyof RoutesTable = any,
  B extends RoutesTable[A]['params'] = RoutesTable[A]['params']
> = {
  name: A
  params?: B
  callback?: OnRouteChangeCb
}

export type HistoryItem<A extends RouteName = any> = {
  id: string
  name: A
  path: string
  search?: Object
  params?: RoutesTable[A]
  replace?: boolean
}

export type RouterState = {
  notFound: boolean
  historyIndex: number
  history: HistoryItem[]
  lastPage: Derive<RouterState, HistoryItem | undefined>
  curPage: Derive<RouterState, HistoryItem>
  ignoreNextPush: boolean
}

let ignoreNextRoute = false

export type OnRouteChangeCb = (item: {
  type: 'push' | 'pop'
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
  historyIndex: -1,
  history: [],
  ignoreNextPush: false,
  lastPage: state => state.history[state.historyIndex - 1],
  curPage: state => state.history[state.historyIndex] || defaultPage,
}

class AlreadyOnPageError extends Error {}
const uid = () => `${Math.random()}`

// const navigateToPath: Action<string> = (om, path) => {
//   const name = path.split('/').find(x => x[0] !== '/')
//   const route = routes[name]

//   if (!route) throw new Error('wah')

//   let params = {}
//   const pathPrefixIndex = route.path.indexOf(':')

//   if (pathPrefixIndex > 0) {
//     const staticPart = route.path.slice(0, pathPrefixIndex)
//     console.log('staticPart', staticPart)
//     const pathParts = route.path.replace().split('/')
//     const keys = route.path.split('/')
//       .filter(x => x[0] === ':')
//       .map(x => x.slice(1))

//     params = keys.reduce((acc, cur) => {
//       acc[cur] =
//       return acc
//     }, {})
//   }

//   om.actions.router.navigate({
//     name,
//     params
//   })
// }

const navigate: Operator<NavigateItem> = pipe(
  map(
    (_, item): HistoryItem => {
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
      _.omit(item, 'id'),
      _.omit(om.state.router.curPage, 'id')
    )
    if (alreadyOnPage) {
      throw new AlreadyOnPageError()
    }
    om.state.router.history = [...om.state.router.history, item]
    if (!item.replace) {
      om.state.router.historyIndex++
    }
  }),
  run((om, item) => {
    console.log(
      'om.state.router.ignoreNextPush',
      om.state.router.ignoreNextPush
    )
    if (!om.state.router.ignoreNextPush) {
      if (onRouteChange) {
        onRouteChange({
          type: 'push',
          name: item.name,
          item: _.last(om.state.router.history),
        })
      }
      if (item.replace) {
        om.effects.router.replace(item.path)
      } else {
        om.effects.router.open(item.path)
      }
    }
  }),
  mutate(om => {
    om.state.router.ignoreNextPush = false
  }),
  catchError<void>((om, error) => {
    om.state.router.ignoreNextPush = false
    if (error instanceof AlreadyOnPageError) {
      // ok
    } else {
      console.error(error)
    }
  })
)

const ignoreNextPush: Action = om => {
  om.state.router.ignoreNextPush = true
}

const back: Action = om => {
  if (om.state.router.historyIndex > 0) {
    // subtract two because back will add one!
    om.state.router.historyIndex -= 2
    window.history.back()
  }
}

const forward: Action = om => {
  if (om.state.router.historyIndex < om.state.router.history.length - 1) {
    // subtract two because forward will add one!
    om.state.router.historyIndex += 2
    window.history.forward()
  }
}

let curSearch = {}

let pop: { path: string; at: number }
window.addEventListener('popstate', event => {
  pop = {
    path: event.state.path,
    at: Date.now(),
  }
})

let isInitialRoute = true

const routeListen: Action<{
  url: string
  name: RouteName
}> = (om, { name, url }) => {
  page(url, ({ params, querystring }) => {
    let isGoingBack = false
    if (pop && Date.now() - pop.at < 30) {
      if (pop.path == getPathFromParams(name, params)) {
        const history = om.state.router.history
        const lastPath = history[history.length - 2].path
        const lastMatches = lastPath == pop.path
        console.log('check it out', lastPath, pop.path)
        isGoingBack = lastMatches
      }
    }

    console.log('page', url, params, { ignoreNextRoute, isGoingBack })
    curSearch = queryString.parse(querystring)

    if (isGoingBack) {
      om.state.router.historyIndex -= 1
      const last = _.last(om.state.router.history)
      if (onRouteChange) {
        onRouteChange({ type: 'pop', name, item: last })
      }
    } else {
      if (ignoreNextRoute) {
        ignoreNextRoute = false
        return
      }
      if (isInitialRoute) {
        isInitialRoute = false
      } else {
        om.actions.router.ignoreNextPush()
      }
      const paramsClean = { ...params }
      om.actions.router.navigate({
        name,
        params: paramsClean,
      })
    }
  })
}

const routeListenNotFound: Action = om => {
  page('*', ctx => {
    console.log('Not found!', ctx)
    om.state.router.notFound = true
  })
}

export const actions = {
  start,
  routeListenNotFound,
  routeListen,
  navigate,
  ignoreNextPush,
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
}: {
  name: string
  params: Object | void
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
    path = path.replace(`:${key}`, params[key])
  }
  return path
}
