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

class Route<A extends Object | void = void> {
  params: A
  constructor(public path: string) {}
}

export const routes = {
  home: new Route('/'),
  login: new Route('/login'),
  register: new Route('/register'),
  search: new Route<{ query: string }>('/search/:query'),
  restaurant: new Route<{ slug: string }>('/restaurant/:slug'),
}

export const routeNames = Object.keys(routes) as RouteName[]
export const routePathToName: { [key in RouteName]: string } = Object.keys(
  routes
).reduce((acc, key) => {
  acc[routes[key].path] = key
  return acc
}, {}) as any

type RoutesTable = typeof routes
type RouteName = keyof RoutesTable

export type NavigateItem<
  A extends keyof RoutesTable = any,
  B extends RoutesTable[A]['params'] = RoutesTable[A]['params']
> = {
  name: A
  params?: B
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
  pageName: string
  urlString: Derive<RouterState, string>
  lastPage: Derive<RouterState, HistoryItem | undefined>
  curPage: Derive<RouterState, HistoryItem>
  ignoreNextPush: boolean
}

let ignoreNextRoute = false
let goingBack = false

const start: AsyncAction = async om => {
  for (const name of routeNames) {
    om.actions.router.routeListen({ url: routes[name].path, name })
  }
  om.actions.router.routeListenNotFound()

  const startingOnHome = window.location.pathname === '/'
  if (startingOnHome) {
    ignoreNextRoute = true
  }

  page.start()

  if (startingOnHome) {
    om.actions.router.navigate({ name: 'home' })
  }
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
  pageName: 'home',
  ignoreNextPush: false,
  lastPage: state => state.history[state.history.length - 2],
  curPage: state => state.history[state.history.length - 1] || defaultPage,
}

class AlreadyOnPageError extends Error {}

const uid = () => `${Math.random()}`

const navigate: Operator<NavigateItem> = pipe(
  map(
    (_, item): HistoryItem => {
      return {
        id: uid(),
        params: {},
        ...item,
        path: getPathFromParams(item.name, item.params as any),
        search: curSearch,
      }
    }
  ),
  mutate((om, item) => {
    om.state.router.notFound = false

    try {
      const alreadyOnPage = isEqual(item, om.state.router.curPage)
      if (alreadyOnPage) {
        throw new AlreadyOnPageError()
      }
      om.state.router.pageName = item.name
      om.state.router.history = [...om.state.router.history, item]
      if (!item.replace) {
        om.state.router.historyIndex++
      }
    } catch (err) {
      console.error('ERROR in parsing item', err)
    }
  }),
  run((om, item) => {
    if (!om.state.router.ignoreNextPush) {
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
  catchError<void>((_, error) => {
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
    goingBack = true
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

const routeListen: Action<{
  url: string
  name: RouteName
}> = (om, { name, url }) => {
  page(url, ({ params, querystring }) => {
    curSearch = queryString.parse(querystring)
    if (ignoreNextRoute) {
      ignoreNextRoute = false
      return
    }
    if (goingBack) {
      goingBack = false
    }
    om.actions.router.ignoreNextPush()
    om.actions.router.navigate({
      name,
      params: { ...params },
    })
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
    ignoreNextRoute = true
    page.show(url)
  },

  replace(url: string) {
    ignoreNextRoute = true
    page.replace(url)
  },
}

function getPathFromParams(name: string, params: Object | void) {
  // object to path
  let path = routes[name].path
  if (!params) return path
  for (const key in params) {
    path = path.replace(`:${key}`, params[key])
  }
  return path
}
