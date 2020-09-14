import { Store, useStore } from '@dish/use-store'
import { createBrowserHistory, createMemoryHistory } from 'history'
import * as React from 'react'
import { createContext, useContext } from 'react'
import { Router as TinyRouter } from 'tiny-request-router'

const history =
  typeof document !== 'undefined'
    ? createBrowserHistory()
    : createMemoryHistory()

// need them to declare the types here
export type RoutesTable = { [key: string]: Route }
export type RouteName = keyof RoutesTable

export type HistoryType = 'push' | 'pop' | 'replace'
export type HistoryDirection = 'forward' | 'backward' | 'none'

export type HistoryItem<A extends RouteName = any> = {
  id: string
  name: A
  path: string
  type: HistoryType
  search: string
  params: Exclude<RoutesTable[A]['params'], void> | { [key: string]: string }
  direction: HistoryDirection
}

export type NavigateItem<
  T = {
    [K in keyof RoutesTable]: {
      name: K
      params?: RoutesTable[K]['params'] | Object
    }
  }
> = T[keyof T] & {
  search?: Object
  replace?: boolean
  callback?: OnRouteChangeCb
}

export type OnRouteChangeCb = (item: HistoryItem) => Promise<void>
type RouterProps = { routes: RoutesTable }
type HistoryCb = (cb: HistoryItem) => void

export class Router extends Store<RouterProps> {
  router = new TinyRouter()
  routes: RoutesTable = {}
  routeNames: string[] = []
  routePathToName = {}
  notFound = false
  history: HistoryItem[] = []
  stack: HistoryItem[] = []
  stackIndex = 0

  get prevPage() {
    return this.stack[this.stackIndex - 1]
  }

  get curPage() {
    return this.stack[this.stackIndex] ?? defaultPage
  }

  get prevHistory() {
    return this.history[this.history.length - 2]
  }

  get curHistory() {
    return this.history[this.history.length - 1] ?? defaultPage
  }

  mount() {
    const { routes } = this.props
    this.routes = routes
    this.routeNames = Object.keys(routes)
    this.routePathToName = Object.keys(routes).reduce((acc, key) => {
      acc[routes[key].path] = key
      return acc
    }, {})

    let nextRouter = this.router
    for (const name of this.routeNames) {
      nextRouter = nextRouter.get(routes[name].path, name)
    }
    nextRouter = nextRouter.all('*', '404')

    this.router = nextRouter

    history.listen((event) => {
      const state = event.location.state as any
      const id = state?.id
      const prevItem = this.stack[this.stackIndex - 1]
      const nextItem = this.stack[this.stackIndex + 1]
      const direction: HistoryDirection =
        prevItem?.id === id
          ? 'backward'
          : nextItem?.id === id
          ? 'forward'
          : 'none'
      const type: HistoryType =
        event.action === 'REPLACE'
          ? 'replace'
          : event.action === 'POP'
          ? 'pop'
          : 'push'
      // console.log('router.history', {
      //   type,
      //   direction,
      //   event,
      //   state,
      //   prevItem,
      //   nextItem,
      //   stack: this.stack,
      // })
      if (type === 'pop' && direction == 'none') {
        // shouldnt happen
        debugger
      }
      this.handlePath(event.location.pathname, {
        id,
        direction,
        type,
      })
    })

    window['router'] = this

    // initial entry
    const pathname = (window.location?.pathname ?? '')
      // temp bugfix: react native has debugger-ui as window.location
      .replace(/\/debugger-ui.*/g, '/')

    history.push(
      {
        pathname,
        search: window.location?.search ?? '',
        hash: window.location?.hash ?? '',
      },
      {
        id: uid(),
      }
    )
  }

  private handlePath(
    pathname: string,
    item: Pick<HistoryItem, 'id' | 'type' | 'direction'>
  ) {
    const match = this.router.match('GET', pathname)
    if (match) {
      const next: HistoryItem = {
        id: item.id ?? uid(),
        type: item.type,
        direction: item.direction,
        name: match.handler,
        path: pathname,
        params: {
          ...Object.keys(match.params).reduce((acc, key) => {
            acc[key] = decodeURIComponent(match.params[key] ?? '')
            return acc
          }, {}),
        },
        search: window.location.search,
      }
      this.history = [...this.history, next]

      switch (item.direction) {
        case 'forward':
          this.stackIndex += 1
          break
        case 'backward':
          this.stackIndex -= 1
          break
        case 'none':
          if (item.type === 'replace') {
            this.stack[this.stackIndex] = next
            this.stack = [...this.stack]
          } else {
            if (this.stackIndex < this.stack.length - 1) {
              // remove future states on next push
              this.stack = this.stack.slice(0, this.stackIndex + 1)
            }
            this.stack = [...this.stack, next]
            this.stackIndex = this.stack.length - 1
          }
          break
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(
          'router.handlePath',
          JSON.stringify({ item, next }, null, 2)
        )
      }

      this.routeChangeListeners.forEach((x) => x(next))
    } else {
      console.log('no match', pathname, item)
    }
  }

  private routeChangeListeners = new Set<HistoryCb>()
  onRouteChange(cb: HistoryCb) {
    if (this.history.length) {
      for (const item of this.history) {
        cb(item)
      }
    }
    this.routeChangeListeners.add(cb)
  }

  getShouldNavigate(navItem: NavigateItem) {
    const historyItem = this.navItemToHistoryItem(navItem)
    const sameName = historyItem.name === this.curPage.name
    const sameParams = isEqual(historyItem.params, this.curPage.params)
    return !sameName || !sameParams
  }

  async navigate(navItem: NavigateItem) {
    const item = this.navItemToHistoryItem(navItem)
    if (this.notFound) {
      this.notFound = false
    }
    if (!this.getShouldNavigate(navItem)) {
      return
    }
    const params = {
      id: item?.id ?? uid(),
    }
    console.warn('router.navigate', navItem, item)
    if (item.type === 'replace') {
      history.replace(item.path, params)
    } else {
      history.push(item.path, params)
    }
  }

  back() {
    history.back()
  }

  forward() {
    history.forward()
  }

  getPathFromParams({
    name,
    params,
  }: {
    name: string
    params?: Object | void
  }) {
    // object to path
    let route = this.routes[name]
    if (!route) {
      console.debug(`no route`, name, this.routes)
      return ``
    }
    if (!route.path) {
      console.debug(`no route path`, route, name, this.routes)
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
        path = path.replace(`:${key}`, params[key] ?? '-')
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

  navItemToHistoryItem(navItem: NavigateItem): HistoryItem {
    const params: any = {}
    // remove undefined params
    if ('params' in navItem && !!navItem.params) {
      for (const key in navItem.params as any) {
        const value = navItem.params[key]
        if (typeof value !== 'undefined') {
          params[key] = value
        }
      }
    }
    return {
      id: uid(),
      direction: 'none',
      name: navItem.name,
      type: navItem.replace ? 'replace' : 'push',
      params,
      path: this.getPathFromParams({
        name: navItem.name,
        params,
      }),
      search: window.location.search,
    }
  }
}

// react stuff

const RouterContext = createContext<RouterProps['routes'] | null>(null)

export function ProvideRouter({
  routes,
  children,
}: {
  routes: any
  children: any
}) {
  // just sets it up
  useStore(Router, {
    routes,
  })
  return (
    <RouterContext.Provider value={routes}>{children}</RouterContext.Provider>
  )
}

export function useRouter() {
  const routes = useContext(RouterContext)
  if (!routes) {
    throw new Error(`no routes`)
  }
  return useStore(Router, { routes })
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

// state

const defaultPage = {
  id: '0',
  name: 'home',
  path: '/',
  params: {},
}

const uid = () => `${Math.random()}`.replace('.', '')

const isObject = (x: any) => x && `${x}` === `[object Object]`
const isEqual = (a: any, b: any) => {
  const eqLen = Object.keys(a).length === Object.keys(b).length
  if (!eqLen) {
    return false
  }
  for (const k in a) {
    if (k in b) {
      if (isObject(a[k]) && isObject(b[k])) {
        if (!isEqual(a[k], b[k])) {
          return false
        }
      }
      if (a[k] !== b[k]) {
        return false
      }
    }
  }
  return true
}
