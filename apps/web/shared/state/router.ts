import {
  HistoryItem,
  NavigateItem,
  Route,
  RouteItem,
  Router,
} from '@dish/router'
import { Action, AsyncAction, derived } from 'overmind'

export type SearchRouteParams = {
  username?: string
  location: string
  lense: string
  search?: string
  tags?: string
}

export const routes = {
  home: new Route('/'),

  // all pages go here
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

  // admin
  admin: new Route('/admin'),
  adminTags: new Route('/admin/dishes'),

  // below pages, more catch-all routes (search)

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

export const router = new Router({
  // @ts-ignore
  routes,
})

export type OnRouteChangeCb = (item: RouteItem) => Promise<void>
let onRouteChange: OnRouteChangeCb | null = null

router.onRouteChange((item) => {
  console.log('item', item)
  onRouteChange?.({
    type: item.replace ? 'replace' : 'push',
    name: item.name,
    item: item,
  })
})

const start: AsyncAction<{
  onRouteChange?: OnRouteChangeCb
}> = async (om, opts) => {
  onRouteChange = opts.onRouteChange ?? null
}

const navigate: AsyncAction<NavigateItem> = async (om, navItem) => {
  await router.navigate(navItem)
}

const back: Action = () => {
  router.back()
}

const forward: Action = () => {
  router.back()
}

const getShouldNavigate: Action<NavigateItem, boolean> = (om, val) => {
  return router.getShouldNavigate(val)
}

type RouterState = {
  notFound: boolean
  history: HistoryItem[]
  prevPage: HistoryItem | undefined
  curPage: HistoryItem
}

export const state: RouterState = {
  notFound: derived<RouterState, boolean>(() => router.notFound),
  history: derived<RouterState, HistoryItem[]>(() => router.history),
  prevPage: derived<RouterState, HistoryItem | undefined>(
    () => router.prevPage
  ),
  curPage: derived<RouterState, HistoryItem>(() => router.curPage),
}

export const actions = {
  start,
  navigate,
  back,
  forward,
  getShouldNavigate,
}

console.log('router', router)

// import { slugify } from '@dish/graph'
// import _, { isEqual } from 'lodash'
// import { Action, AsyncAction, derived } from 'overmind'
// import page from 'page'
// import queryString from 'query-string'

// import { race } from '../helpers/race'

// const og = history.replaceState.bind(history)
// history.replaceState = function (...args) {
//   console.trace('replaceState', ...args)
//   return og(...args)
// }

// const og2 = history.pushState.bind(history)
// history.pushState = function (...args) {
//   console.trace('pushState', ...args)
//   return og2(...args)
// }

// export type HistoryItem<A extends RouteName = any> = {
//   id: string
//   name: A
//   path: string
//   type?: 'push' | 'pop'
//   search?: Object
//   params?: RoutesTable[A]['params']
//   replace?: boolean
// }

// export type RouterState = {
//   notFound: boolean
//   history: HistoryItem[]
//   prevPage: HistoryItem | undefined
//   curPage: HistoryItem
// }

// // we could enable functionality like this
// export type LoadableView = React.SFC & {
//   fetchData: (params: HistoryItem) => Promise<any>
// }

// export type PageRouteView = LoadableView | Promise<LoadableView>

// class Route<A extends Object | void = void> {
//   constructor(
//     public path: string,
//     public page?: PageRouteView,
//     public params?: A
//   ) {}
// }

// export type SearchRouteParams = {
//   username?: string
//   location: string
//   lense: string
//   search?: string
//   tags?: string
// }

// export type NavigateItem<
//   T = {
//     [K in keyof RoutesTable]: {
//       name: K
//       params?: RoutesTable[K]['params']
//     }
//   }
// > = T[keyof T] & {
//   search?: Object
//   replace?: boolean
//   callback?: OnRouteChangeCb
// }

// let ignoreNextRoute = false

// export type RouteItem = {
//   type: 'push' | 'pop' | 'replace'
//   name: RouteName
//   item: HistoryItem
// }
// export type OnRouteChangeCb = (item: RouteItem) => Promise<void>

// let onRouteChange: OnRouteChangeCb | null = null
// let finishStart: Function
// let onFinishStart = new Promise((res) => {
//   finishStart = res
// })

// const start: AsyncAction<{
//   onRouteChange?: OnRouteChangeCb
// }> = async (om, opts) => {
//   onRouteChange = opts.onRouteChange ?? null

//   for (const name of routeNames) {
//     om.actions.router.routeListen({
//       name,
//       url: routes[name].path,
//     })
//   }

//   page.start({
//     click: false,
//   })

//   await onFinishStart
// }

// // state

// const defaultPage = {
//   id: '0',
//   name: 'home',
//   path: '/',
//   params: {},
// }

// export const state: RouterState = {
//   notFound: false,
//   history: [],
//   prevPage: derived<RouterState, HistoryItem | undefined>(
//     (state) => state.history[state.history.length - 2]
//   ),
//   curPage: derived<RouterState, HistoryItem>(
//     (state) => state.history[state.history.length - 1] || defaultPage
//   ),
// }

// const uid = () => `${Math.random()}`

// export const navItemToHistoryItem = (navItem: NavigateItem): HistoryItem => {
//   const params = {}

//   // remove undefined params
//   if ('params' in navItem && !!navItem.params) {
//     for (const key in navItem.params) {
//       const value = navItem.params[key]
//       if (typeof value !== 'undefined') {
//         params[key] = value
//       }
//     }
//   }

//   return {
//     id: uid(),
//     ...navItem,
//     type: 'push',
//     params,
//     path: getPathFromParams({
//       name: navItem.name,
//       params,
//     }),
//     search: curSearch,
//   }
// }

// const getShouldNavigate: Action<NavigateItem, boolean> = (om, val) => {
//   const historyItem = navItemToHistoryItem(val)
//   const curPage = om.state.router.curPage
//   return (
//     historyItem.name !== curPage.name ||
//     !isEqual(historyItem.params, curPage.params)
//   )
// }

// const navigate: AsyncAction<NavigateItem> = async (om, navItem) => {
//   const item = navItemToHistoryItem(navItem)

//   if (om.state.router.notFound) {
//     om.state.router.notFound = false
//   }

//   if (!getShouldNavigate(om, navItem)) {
//     console.log('already on page', navItem)
//     return
//   }

//   if (process.env.NODE_ENV === 'development') {
//     console.log('router.navigate', JSON.stringify(item))
//   }

//   if (item.replace) {
//     const next = _.dropRight(om.state.router.history)
//     om.state.router.history = [...next, item]
//     om.effects.router.replace(item.path)
//   } else {
//     om.state.router.history = [...om.state.router.history, item]
//     om.effects.router.open(item.path)
//   }

//   onRouteChange?.({
//     type: item.replace ? 'replace' : 'push',
//     name: item.name,
//     item: _.last(om.state.router.history)!,
//   })
// }

// const back: Action = (om) => {
//   window.history.back()
// }

// const forward: Action = (om) => {
//   window.history.forward()
// }

// let curSearch = {}

// let pop: { path: string; at: number } | null = null
// addEventListener('popstate', (event) => {
//   pop = {
//     path: event.state.path,
//     at: Date.now(),
//   }
// })

// const routeListen: Action<{
//   url: string
//   name: RouteName
// }> = (om, { name, url }) => {
//   page(url, async (ctx) => {
//     console.log('state1', ctx.state)

//     let isGoingBack = false
//     if (pop && Date.now() - pop.at < 30) {
//       if (pop.path == getPathFromParams({ name, params: ctx.params })) {
//         const history = om.state.router.history
//         const last = history[history.length - 2] ?? history[history.length - 1]
//         const lastPath = last.path
//         const lastMatches = lastPath == pop.path
//         isGoingBack = lastMatches
//       }
//     } else {
//       ctx.state.id = `${Math.random()}`
//       // ctx.save()
//     }

//     console.log('state2', isGoingBack, ctx.state)

//     if (process.env.NODE_ENV === 'development') {
//       console.debug('page.js routing', url)
//     }

//     curSearch = queryString.parse(ctx.querystring)

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
//       const paramsClean = Object.keys(ctx.params).reduce((acc, cur) => {
//         if (ctx.params[cur]) {
//           acc[cur] = ctx.params[cur]
//         }
//         return acc
//       }, {})
//       const args: NavigateItem = {
//         name,
//         params: paramsClean as any,
//       }
//       // go go go
//       await race(om.actions.router.navigate(args), 2000, 'router.navigate', {
//         warnOnly: true,
//       })

//       finishStart()
//     }
//   })
// }

// export const actions = {
//   start,
//   routeListen,
//   navigate,
//   back,
//   forward,
//   getShouldNavigate,
// }

// // effects

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

// export const getPathFromParams = ({
//   name,
//   params,
//   convertToSlug,
// }: {
//   name: string
//   params?: Object | void
//   convertToSlug?: boolean
// }) => {
//   // object to path
//   let route = routes[name]
//   if (!route?.path) {
//     return ``
//   }
//   let path = route.path
//   if (!params) return path
//   let replaceSplatParams: string[] = []
//   for (const key in params) {
//     if (typeof params[key] === 'undefined') {
//       continue
//     }
//     if (path.indexOf(':') > -1) {
//       path = path.replace(
//         `:${key}`,
//         convertToSlug ? slugify(params[key]) : params[key]
//       )
//     } else if (path.indexOf('*') > -1) {
//       replaceSplatParams.push(key)
//     }
//   }

//   // remove unused optionals optionals
//   if (path.indexOf('/:') > 0) {
//     path = path.replace(/\/:[a-zA-Z-_]+\??/gi, '')
//   }

//   if (replaceSplatParams.length) {
//     path = path.replace(
//       '*',
//       replaceSplatParams.map((key) => `${key}/${params[key]}`).join('/')
//     )
//   }

//   // remove extra stuffs
//   path = path.replace(/\?/g, '')
//   path = path.replace(/(\/\:[^\/]+)/g, '')

//   return path
// }

// // // https://stackoverflow.com/questions/8980255/how-do-i-retrieve-if-the-popstate-event-comes-from-back-or-forward-actions-with
// // // determine forward or back
// // let direction = 0
// // function reorient(e?) {
// //   const positionLastShown = Number(
// //     sessionStorage.getItem('positionLastShown') ?? 0
// //   )
// //   let position = e?.state ?? history.state // Absolute position in stack
// //   if (position === null) {
// //     position = positionLastShown + 1 // Top of stack
// //     history.replaceState(position, '')
// //   } else {
// //     console.log('pos is', position)
// //     position = 0
// //   }
// //   sessionStorage.setItem('positionLastShown', String(position))
// //   direction = Math.sign(position - positionLastShown)
// //   console.log('Travel direction is ' + direction, position, positionLastShown)
// // }

// // addEventListener('pageshow', reorient)
// // addEventListener('popstate', reorient)
