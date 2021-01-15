import { Store, createStore, useStore, useStoreSelector } from '@dish/use-store'
import { createBrowserHistory, createMemoryHistory } from 'history'
import * as React from 'react'
import { createContext, useContext } from 'react'
import { Router as TinyRouter } from 'tiny-request-router'

// TODO fix HistoryType to narrow types

const history =
  typeof document !== 'undefined'
    ? createBrowserHistory()
    : createMemoryHistory()

// need them to declare the types here
export type RoutesTable = {
  [key: string]: Route<any>
}
export type RouteName = keyof RoutesTable

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
type RouterProps = { routes: RoutesTable }
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
      let type: HistoryType =
        event.action === 'REPLACE'
          ? 'replace'
          : event.action === 'POP'
          ? 'pop'
          : 'push'

      if (process.env.DEBUG) {
        console.log('router.history', {
          type,
          direction,
          event,
          state,
          prevItem,
          nextItem,
          stack: this.stack,
        })
      }

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

  private handlePath(
    pathname: string,
    item: Pick<HistoryItem, 'id' | 'type' | 'direction'>
  ) {
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
          if (this.stackIndex < this.stack.length - 1) {
            // remove future states on next push
            this.stack = this.stack.slice(0, this.stackIndex + 1)
          }
          this.stack = [...this.stack, next]
          this.stackIndex = this.stack.length - 1
        }
        break
    }

    // if (process.env.NODE_ENV === 'development') {
    //   console.log(
    //     'router.handlePath',
    //     JSON.stringify({ item, next }, null, 2)
    //   )
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
    const historyItem = this.getHistoryItem(navItem)
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

  async navigate(navItem: NavigateItem<RT>) {
    const item = this.getHistoryItem(navItem)
    if (this.notFound) {
      this.notFound = false
    }
    if (!this.getShouldNavigate(navItem)) {
      return
    }
    const params = {
      id: item?.id ?? uid(),
    }
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
    name?: string
    params?: Object | void
  }) {
    if (!name) return ``
    // object to path
    let route = this.routes[name]
    if (!route) {
      console.log(`no route`, name, this.routes)
      return ``
    }
    if (!route.path) {
      console.log(`no route path`, route, name, this.routes)
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

  getHistoryItem(navItem: NavigateItem<RT>): HistoryItem {
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
      name: navItem.name as any,
      type: navItem.replace ? 'replace' : 'push',
      params,
      path: this.getPathFromParams({
        name: navItem.name as any,
        params,
      }),
      search: window.location?.search ?? '',
    }
  }
}

// react stuff

const RouterPropsContext = createContext<any>(null)

export type ProvideRouterProps = {
  children: any
} & { routes: RoutesTable }

export function ProvideRouter(props: ProvideRouterProps) {
  return (
    <RouterPropsContext.Provider value={props.routes}>
      {props.children}
    </RouterPropsContext.Provider>
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
  constructor(
    public path: string,
    public page?: PageRouteView,
    public params?: A
  ) {}
}

// state

const defaultPage: HistoryItem = {
  id: '0',
  name: 'home',
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

// sanity check types

type NavigableItems<Table extends RoutesTable> = {
  [Property in keyof Table]: {
    name: Property
    params: Table[Property]['params']
    search?: string
    replace?: boolean
    callback?: OnRouteChangeCb
  }
}

export type NavigateItem<
  RT extends RoutesTable,
  Items extends NavigableItems<RT> = NavigableItems<RT>
> = Items[keyof Items]

// const router = createStore(Router, {
//   routes: {
//     name: new Route<{ hi: boolean }>(''),
//     alt: new Route<{ other: string }>(''),
//   },
// })

// // good
// router.navigate({
//   name: 'name',
//   params: {
//     hi: true,
//   },
// })
// // good
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
// // bad
// router.navigate({
//   name: 'alt',
//   params: {
//     other: true,
//   },
// })
// // bad
// router.navigate({
//   name: 'name',
//   params: {
//     hi: '',
//   },
// })
// // bad
// router.navigate({
//   name: 'falsename',
//   params: {
//     hi: '',
//   },
// })
