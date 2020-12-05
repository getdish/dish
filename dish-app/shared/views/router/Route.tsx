import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useForceUpdate } from 'snackui'

import { routePathToName, router, routes } from '../../state/router'
import { useOvermind } from '../../state/useOvermind'

type RouteState = 'collect' | 'active' | 'inactive'

type RouteContextI = {
  getState: () => RouteState
  onChangeState: (a: (state: RouteState) => void) => () => void
  setRoute: ((name: string, showing: boolean) => void) | null
}

const RouteContext = createContext<RouteContextI | null>(null)

export function RouteSwitch(props: { children: any }) {
  console.log('ROUTE SWITCH')
  const children = React.Children.toArray(props.children)
  const [activeRoutes, setActiveRoutes] = useState({})
  const names = children.map((x) => x['props'].name)
  const activeIndex = useRef(0)
  const stateListenerIndex = useRef(new WeakMap())
  const stateListeners = useRef(new Set<Function>())

  const nextActiveIndex = names.findIndex((x) => activeRoutes[x])
  const getState = (index: number): RouteState =>
    activeIndex.current <= -1
      ? 'collect'
      : activeIndex.current === index
      ? 'active'
      : 'inactive'

  useLayoutEffect(() => {
    activeIndex.current = nextActiveIndex
    for (const listener of [...stateListeners.current]) {
      const index = stateListenerIndex.current.get(listener)
      const state = getState(index)
      listener(state)
    }
  }, [activeIndex.current, nextActiveIndex])

  const childrenContexts = useMemo<RouteContextI[]>(() => {
    return children.map((_, index) => {
      return {
        onChangeState(cb) {
          stateListenerIndex.current.set(cb, index)
          stateListeners.current.add(cb)
          return () => {
            stateListeners.current.delete(cb)
            stateListenerIndex.current.delete(cb)
          }
        },
        getState() {
          return getState(index)
        },
        setRoute: (name, next) => {
          setActiveRoutes((x) => ({
            ...x,
            [name]: next,
          }))
        },
      }
    })
  }, [])

  console.log('activeRoutes', activeRoutes)

  //  we could have the stratey here of first hiding the prev route, then later
  //  on requestIdle unmounting things... but concurrent should sovle for us right?

  return (
    <>
      {children.map((child, index) => {
        return (
          <RouteContext.Provider key={index} value={childrenContexts[index]}>
            {child}
          </RouteContext.Provider>
        )
      })}
    </>
  )
}

export function Route(props: { name: string; exact?: boolean; children: any }) {
  const om = useOvermind()
  const activeName = om.state.router.curPageName
  const stateRef = useRef<RouteState>('active')
  const forceUpdate = useForceUpdate()
  const routeContext = useContext(RouteContext)
  const isExactMatching = !!props.exact && activeName === props.name
  const routePath = routes[props.name].path
  const routePaths: string[] = Object.keys(routes).map((x) => routes[x].path)
  const childRouteNames = routePaths
    .filter((p) => p.indexOf(routePath) === 0)
    .map((path) => routePathToName[path])
  const isParentMatching = childRouteNames.some((x) => x === activeName)
  const isMatched = !!(isParentMatching || isExactMatching)

  console.log(
    9393,
    om.state.router,
    om.state.router.curPage.name,
    typeof activeName,
    isExactMatching,
    isParentMatching,
    routePath,
    props
  )

  useLayoutEffect(() => {
    return routeContext?.onChangeState((state) => {
      if (state != stateRef.current) {
        stateRef.current = state
        forceUpdate()
      }
    })
  }, [routeContext])

  useLayoutEffect(() => {
    routeContext?.setRoute?.(props.name, isMatched)
  }, [props.name, isMatched])

  const children = useMemo(() => {
    if (props.exact) {
      if (isExactMatching) {
        return getChildren(props.children)
      }
      return null
    }

    // parent matching
    if (isParentMatching) {
      return getChildren(props.children)
    }

    return null
  }, [
    props.exact,
    props.children,
    isMatched,
    isExactMatching,
    isParentMatching,
  ])

  const state = stateRef.current
  console.log(children, {
    isParentMatching,
    state,
  })
  if (state === 'inactive' || state === 'collect') {
    return null
  }

  return children
}

function getChildren(children: Function | any) {
  if (typeof children === 'function') {
    return children()
  }
  return children
}

export function PrivateRoute(props: { name: string; children: any }) {
  const om = useOvermind()
  const isLoggedIn = om.state.user.isLoggedIn
  const curPageName = om.state.router.curPage.name

  useLayoutEffect(() => {
    if (curPageName === props.name) {
      if (!isLoggedIn) {
        router.navigate({ name: 'login' })
      }
    }
  }, [curPageName, isLoggedIn])

  if (isLoggedIn) {
    return <Route {...props} />
  }

  return null
}
