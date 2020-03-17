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
// import queryString from 'query-string'

export const urls = {
  home: '/',
  login: '/login',
  register: '/register',
  search: '/search/:query',
  restaurant: '/restaurant/:slug',
}

type RouteName = keyof typeof urls

const routeNames = Object.keys(urls) as RouteName[]

type Params = {
  [key: string]: string | number | boolean | undefined
}

type HistoryItem = {
  name: RouteName
  path: string
  params?: Params
  replace?: boolean
}

export type RouterState = {
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
  om.actions.router.routeListenNotFound()

  for (const name of routeNames) {
    om.actions.router.routeListen({ url: urls[name], name })
  }

  const startingOnHome = window.location.pathname === '/'
  if (startingOnHome) {
    ignoreNextRoute = true
  }
  om.effects.router.watchPage()
  if (startingOnHome) {
    om.actions.router.navigate('/')
  }
}

// state

export const state: RouterState = {
  historyIndex: -1,
  history: [],
  pageName: 'home',
  ignoreNextPush: false,
  lastPage: state => state.history[state.history.length - 2],
  curPage: state =>
    state.history[state.history.length - 1] || {
      name: 'home',
      path: '/',
      params: {},
    },
  urlString: state => (state.curPage ? `orbit:/${state.curPage.path}` : ''),
}

class AlreadyOnPageError extends Error {}

const navigate: Operator<string | HistoryItem> = pipe(
  map((om, x) => {
    let item: HistoryItem

    if (typeof x == 'string') {
      item = {
        // for now just dumb map it
        name: x.split('/')[1] as any,
        path: x,
        // TODO MATCH
        params: {},
      }
    } else {
      item = x
    }
    return item
  }),
  mutate((om, item) => {
    const alreadyOnPage =
      JSON.stringify(item) === JSON.stringify(om.state.router.curPage)
    if (alreadyOnPage) {
      throw new AlreadyOnPageError()
    }
    om.state.router.pageName = item.name
    om.state.router.history = [...om.state.router.history, item]
    if (!item.replace) {
      om.state.router.historyIndex++
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

const routeListen: Action<{
  url: string
  name: RouteName
}> = (om, { name, url }) => {
  page(url, ({ params, querystring }) => {
    if (ignoreNextRoute) {
      ignoreNextRoute = false
      return
    }
    if (goingBack) {
      goingBack = false
    }
    om.actions.router.ignoreNextPush()

    // object to path
    let path = urls[name]
    for (const key in params) {
      path = path.replace(`:${key}`, params[key])
    }

    om.actions.router.navigate({
      name,
      path: path,
      params: { ...params },
      // search: queryString.parse(querystring)
    })
  })
}

const routeListenNotFound: Action = () => {
  page('*', ctx => {
    console.log('Not found!', ctx)
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
  watchPage() {
    page.start()
  },

  open(url: string) {
    ignoreNextRoute = true
    page.show(url)
  },

  replace(url: string) {
    ignoreNextRoute = true
    page.replace(url)
  },
}
