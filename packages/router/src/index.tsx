import { Store, useStore, useStoreSelector } from '@dish/use-store'
import { createBrowserHistory, createMemoryHistory } from 'history'
import * as React from 'react'
import { createContext, useContext } from 'react'
import { Router as TinyRouter } from 'tiny-request-router'

// TODO fix HistoryType to narrow types

const history =
  process.env.TARGET === 'node' ||
  typeof document === 'undefined' ||
  navigator?.userAgent.includes('jsdom')
    ? createMemoryHistory()
    : createBrowserHistory()

// need them to declare the types here
export interface RoutesTable {
  [key: string]: Route<any>
}
export type RouteName = string

export type RouteAlert<A extends RoutesTable> = {
  condition: (next: 'unload' | NavigateItem<A>) => boolean
  message: string
}

export type HistoryType = 'push' | 'pop' | 'replace'
export type HistoryDirection = 'forward' | 'backward' | 'none'

export type HistoryItem<A extends RouteName = string> = {
  id: string
  name: A
  path: string
  type: HistoryType
  search: string
  params: Exclude<RoutesTable[A]['params'], void> | { [key: string]: string }
  direction: HistoryDirection
}

export type OnRouteChangeCb = (item: HistoryItem) => Promise<void>
type RouterProps = { routes: RoutesTable; skipInitial?: boolean }
type HistoryCb = (cb: HistoryItem) => void

export class Router<
  Props extends RouterProps,
  RT extends RoutesTable = Props['routes']
> extends Store<Props> {
  router = new TinyRouter()
  routes: RoutesTable = {}
  routeNames: string[] = []
  routePathToName = {}
  notFound = false
  history: HistoryItem[] = []
  stack: HistoryItem[] = []
  stackIndex = 0
  alert: RouteAlert<RT> | null = null
  getPathFromParams = getPathFromParams.bind(null, this)

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
        prevItem?.id === id ? 'backward' : nextItem?.id === id ? 'forward' : 'none'
      let type: HistoryType =
        event.action === 'REPLACE' ? 'replace' : event.action === 'POP' ? 'pop' : 'push'

      // if (process.env.DEBUG) {
      //   // prettier-ignore
      //   console.log('router.history', { type,direction,event,state,prevItem,nextItem,stack: this.stack })
      // }

      if (type === 'pop' && direction == 'none') {
        // happens when they go back after a hard refresh, change to push
        type = 'push'
      }

      this.handlePath(event.location.pathname, {
        id,
        direction,
        type,
      })
    })

    // initial entry
    if (!this.props.skipInitial) {
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
  }

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

  private handlePath(pathname: string, item: Pick<HistoryItem, 'id' | 'type' | 'direction'>) {
    const match = this.router.match('GET', pathname)
    if (!match) {
      console.log('no match', pathname, item)
      return
    }
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
      search: window.location?.search ?? '',
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
          if (this.stackIndex < this.stack.length) {
            // remove future states on next push
            this.stack = this.stack.slice(0, this.stackIndex + 1)
          }
          this.stack = [...this.stack, next]
          this.stackIndex = this.stack.length - 1
        }
        break
    }

    // if (process.env.NODE_ENV === 'development') {
    //   console.log('router.handlePath', JSON.stringify({ item, next }, null, 2))
    // }

    this.routeChangeListeners.forEach((x) => x(next))
  }

  private routeChangeListeners = new Set<HistoryCb>()
  onRouteChange(cb: HistoryCb, ignoreHistory = false) {
    if (!ignoreHistory) {
      if (this.history.length) {
        for (const item of this.history) {
          cb(item)
        }
      }
    }
    this.routeChangeListeners.add(cb)
    return () => {
      this.routeChangeListeners.delete(cb)
    }
  }

  getShouldNavigate(navItem: NavigateItem<RT>) {
    const historyItem = getHistoryItem(this, navItem as any)
    const sameName = historyItem.name === this.curPage.name
    const sameParams = isEqual(
      this.getNormalizedParams(historyItem.params),
      this.getNormalizedParams(this.curPage.params)
    )
    return !sameName || !sameParams
  }

  // remove nullish params
  private getNormalizedParams(params: Object | null) {
    const obj = params ?? {}
    return Object.keys(obj).reduce((acc, cur) => {
      if (obj[cur]) {
        acc[cur] = obj[cur]
      }
      return acc
    }, {})
  }

  getIsRouteActive(navItem: NavigateItem<RT>) {
    return !this.getShouldNavigate(navItem)
  }

  navigate(navItem: NavigateItem<RT>) {
    const item = getHistoryItem(this, navItem as any)
    if (this.notFound) {
      this.notFound = false
    }
    if (!this.getShouldNavigate(navItem)) {
      return
    }
    const params = {
      id: item?.id ?? uid(),
    }
    if (this.alert?.condition(navItem)) {
      if (!confirm(this.alert.message)) {
        return
      }
    }
    if (item.type === 'replace') {
      history.replace(item.path, params)
    } else {
      history.push(item.path, params)
    }
  }

  setParams(params: any) {
    this.navigate({
      name: this.curPage.name,
      search: this.curPage.search,
      params: {
        ...this.curPage.params,
        ...params,
      },
      replace: true,
    } as NavigateItem<RT>)
  }

  back() {
    history.back()
  }

  forward() {
    history.forward()
  }

  setRouteAlert(alert: RouteAlert<RT> | null) {
    const prev = this.alert
    this.alert = alert
    setUnloadCondition(alert)
    return () => {
      setUnloadCondition(prev)
      this.alert = prev
    }
  }
}

const stripExtraPathSegments = (path: string) => {
  return path.replace(/\/:[a-zA-Z-_]+[\?]?/g, '')
}

export function getPathFromParams(
  { routes }: Router<any>,
  {
    name,
    params,
  }: {
    name?: string
    params?: Object | void
  }
) {
  if (!name) {
    return ``
  }

  // object to path
  let route = routes[name]

  if (!route) {
    console.log(`no route`, name, routes)
    return ``
  }
  if (!route.path) {
    console.log(`no route path`, route, name, routes)
    return ``
  }

  let path = route.path

  if (!params) {
    return stripExtraPathSegments(path)
  }

  let replaceSplatParams: string[] = []
  for (const key in params) {
    if (typeof params[key] === 'undefined') {
      continue
    }
    if (path.includes(':')) {
      path = path.replace(new RegExp(`:${key}[\?]?`), params[key] ?? '-')
    } else if (path.indexOf('*') > -1) {
      replaceSplatParams.push(key)
    }
  }

  // remove unused optionals optionals
  if (path.includes('/:')) {
    path = stripExtraPathSegments(path)
  }

  if (replaceSplatParams.length) {
    path = path.replace('*', replaceSplatParams.map((key) => `${key}/${params[key]}`).join('/'))
  }

  return path
}

export function getHistoryItem(router: Router<any>, navItem: NavigateItem): HistoryItem {
  const params: any = {}
  // remove undefined params
  if ('params' in navItem) {
    const p = navItem['params']
    for (const key in p) {
      const val = p[key]
      if (typeof val !== 'undefined') {
        params[key] = val
      }
    }
  }
  return {
    id: uid(),
    direction: 'none',
    name: navItem.name as any,
    type: navItem.replace ? 'replace' : 'push',
    params,
    path: getPathFromParams(router, {
      name: navItem.name as any,
      params,
    }),
    search: window.location?.search ?? '',
  }
}

// react stuff

const RouterPropsContext = createContext<any>(null)

export type ProvideRouterProps = {
  children: any
} & { routes: RoutesTable }

export function ProvideRouter(props: ProvideRouterProps) {
  return (
    <RouterPropsContext.Provider value={props.routes}>{props.children}</RouterPropsContext.Provider>
  )
}

export function useRouter() {
  const routes = useContext(RouterPropsContext)
  if (!routes) {
    throw new Error(`Must <ProvideRouter /> above this component`)
  }
  return useStore(Router, { routes })
}

export function useRouterSelector<
  A extends (a: Router<any>) => any,
  Res = A extends (a: Router<any>) => infer B ? B : unknown
>(selector: A) {
  const routes = useContext(RouterPropsContext)
  if (!routes) {
    throw new Error(`Must <ProvideRouter /> above this component`)
  }
  return useStoreSelector(Router, selector, { routes }) as Res
}

// we could enable functionality like this
export type LoadableView = React.FunctionComponent & {
  fetchData: (params: HistoryItem) => Promise<any>
}

export type PageRouteView = LoadableView | Promise<LoadableView>

export class Route<A extends Object | void = void> {
  constructor(public path: string, public page?: PageRouteView, public params?: A) {}

  toString() {
    return JSON.stringify({
      path: this.path,
      params: this.params,
    })
  }
}

// state

const defaultPage: HistoryItem = {
  id: '0',
  name: 'null',
  path: '/',
  params: {},
  type: 'push',
  search: '',
  direction: 'none',
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

function setUnloadCondition(alert: RouteAlert<any> | null) {
  window.onbeforeunload = () => (alert?.condition('unload') ? alert.message : null)
}

// sanity check types

type NavigableItems<Table extends RoutesTable> = {
  [Property in keyof Table]: Table[Property]['params'] extends void
    ? {
        name: Property
        search?: string
        params?: void
        replace?: boolean
        callback?: OnRouteChangeCb
      }
    : {
        name: Property
        params: Table[Property]['params']
        search?: string
        replace?: boolean
        callback?: OnRouteChangeCb
      }
}

export type NavigateItem<
  RT extends RoutesTable = any,
  Items extends NavigableItems<RT> = NavigableItems<RT>
> = Items[keyof Items]

// const router = createStore(Router, {
//   routes: {
//     name: new Route<{ hi: boolean }>(''),
//     alt: new Route<{ other: string }>(''),
//     alt2: new Route(''),
//   },
// })
//
// // good
// router.navigate({
//   name: 'name',
//   params: {
//     hi: true,
//   },
// })
// router.navigate({
//   name: 'alt2',
// })
// router.navigate({
//   name: 'alt',
//   params: {
//     other: '',
//   },
// })
// // bad
// router.navigate({
//   name: 'alt',
//   replace: '',
//   params: {
//     hi: true,
//   },
// })
// router.navigate({
//   name: 'alt',
//   params: {
//     other: true,
//   },
// })
// router.navigate({
//   name: 'name',
//   params: {
//     hi: '',
//   },
// })
// router.navigate({
//   name: 'falsename',
//   params: {
//     hi: '',
//   },
// })
