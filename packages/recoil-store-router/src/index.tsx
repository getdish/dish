import { Store, useRecoilStore } from '@dish/recoil-store'
import * as React from 'react'
import { createContext, useContext } from 'react'
import { Router } from 'tiny-request-router'

// need them to declare the types here
export type RoutesTable = { [key: string]: Route }
export type RouteName = keyof RoutesTable

type HistoryDirection = 'push' | 'pop'

export type HistoryItem<A extends RouteName = any> = {
  id: string
  name: A
  path: string
  type?: HistoryDirection
  search?: Object
  params?: RoutesTable[A]['params']
  replace?: boolean
}

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

export type RouteItem = {
  type: 'push' | 'pop' | 'replace'
  name: RouteName
  item: HistoryItem
}

export type OnRouteChangeCb = (item: RouteItem) => Promise<void>

type RouterProps = { routes: RoutesTable }

class RouterStore extends Store<RouterProps> {
  started = false
  router = new Router()
  routes: RoutesTable = {}
  routeNames: string[] = []
  routePathToName = {}
  notFound = false
  history: HistoryItem[] = []

  get prevPage() {
    return this.history[this.history.length - 2]
  }

  get curPage() {
    return this.history[this.history.length - 1] ?? defaultPage
  }

  constructor(props: RouterProps) {
    super(props)
    if (this.started) {
      throw new Error(`Already started router`)
    }
    const { routes } = props
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
    this.started = true

    window.addEventListener('popstate', (event) => {
      this.handlePath(event.state.path, this.getPopDirection())
    })
    this.handlePath(window.location.pathname)
  }

  private handlePath(
    pathname: string,
    direction?: HistoryDirection,
    navItem?: NavigateItem
  ) {
    const match = this.router.match('GET', pathname)
    if (match) {
      this.history = [
        ...this.history,
        {
          id: uid(),
          type: direction,
          name: match.handler,
          path: pathname,
          params: match.params as any,
          replace: navItem?.replace,
          search: navItem?.search,
        },
      ]
    }
  }

  private getShouldNavigate(navItem: NavigateItem) {
    const historyItem = this.navItemToHistoryItem(navItem)
    const { id: _1, replace: _2, ...compareA } = historyItem
    const { id: _3, replace: _4, ...compareB } = this.curPage
    return JSON.stringify(compareA) !== JSON.stringify(compareB)
  }

  async navigate(navItem: NavigateItem) {
    const item = this.navItemToHistoryItem(navItem)
    if (this.notFound) {
      this.notFound = false
    }
    if (!this.getShouldNavigate(navItem)) {
      console.log('already on page')
      return
    }
    if (item.replace) {
      history.replaceState({}, '', item.path)
    } else {
      history.pushState({}, '', item.path)
    }
    this.handlePath(item.path, 'push', navItem)
  }

  back() {
    window.history.back()
  }

  forward() {
    window.history.forward()
  }

  private getPathFromParams({
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
        path = path.replace(`:${key}`, params[key])
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

  private navItemToHistoryItem(navItem: NavigateItem): HistoryItem {
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
      ...navItem,
      type: 'push',
      params,
      path: this.getPathFromParams({
        name: navItem.name,
        params,
      }),
      search: curSearch,
    }
  }

  // 1 is forward
  // -1 is back
  private getPopDirection(): HistoryDirection {
    const positionLastShown = Number(
      sessionStorage.getItem('positionLastShown')
    )
    let position = history.state
    if (position === null) {
      position = positionLastShown + 1
      history.replaceState(position, '')
    }
    sessionStorage.setItem('positionLastShown', `${position}`)
    const direction = Math.sign(position - positionLastShown)
    return direction === 1 ? 'push' : 'pop'
  }
}

const RouterContext = createContext<RouterProps['routes'] | null>(null)

export function ProvideRouter({
  routes,
  children,
}: {
  routes: any
  children: any
}) {
  // just sets it up
  useRecoilStore(RouterStore, {
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
  return useRecoilStore(RouterStore, { routes })
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

const uid = () => `${Math.random()}`
let curSearch = {}

// const routeListen: Action<{
//   url: string
//   name: RouteName
// }> = (om, { name, url }) => {
//   page(url, async ({ params, querystring }) => {
//     let isGoingBack = false
//     if (pop && Date.now() - pop.at < 30) {
//       if (pop.path == getPathFromParams({ name, params })) {
//         const history = om.state.router.history
//         const last = history[history.length - 2] ?? history[history.length - 1]
//         const lastPath = last.path
//         const lastMatches = lastPath == pop.path
//         isGoingBack = lastMatches
//       }
//     }

//     if (!ignoreNextRoute) {
//       console.log('page.js routing', {
//         url,
//         params,
//         isGoingBack,
//       })
//     }

//     curSearch = queryString.parse(querystring)

//     if (isGoingBack) {
//       const last = _.last(om.state.router.history)
//       if (last && onRouteChange) {
//         onRouteChange({ type: 'pop', name, item: last })
//       }
//     } else {
//       if (ignoreNextRoute) {
//         ignoreNextRoute = false
//         return
//       }
//       const paramsClean = Object.keys(params).reduce((acc, cur) => {
//         if (params[cur]) {
//           acc[cur] = params[cur]
//         }
//         return acc
//       }, {})

//       const args: NavigateItem = {
//         name,
//         params: paramsClean,
//       } as any

//       // go go go
//       await race(om.actions.router.navigate(args), 2000, 'router.navigate', {
//         warnOnly: true,
//       })

//       finishStart()
//     }
//   })
// }

// effects

// export const effects = {
//   open(url: string) {
//     ignoreNextRoute = true
//     page.show(url)
//   },

//   replace(url: string) {
//     ignoreNextRoute = true
//     page.replace(url)
//   },
// }
