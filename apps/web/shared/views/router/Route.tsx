import { HistoryItem } from '@dish/router'
import { VStack } from '@dish/ui'
import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

import { routePathToName, router, routes } from '../../state/router'
import { useOvermind } from '../../state/useOvermind'

type RouteContextI = {
  state: 'collect' | 'active' | 'inactive'
  setRoute: ((name: string, showing: boolean) => void) | null
}

const RouteContext = createContext<RouteContextI | null>(null)

export function RouteSwitch(props: { children: any }) {
  const children = React.Children.toArray(props.children)
  const [activeRoutes, setActiveRoutes] = useState({})
  const names = children.map((x) => x['props'].name)
  const activeIndex = names.findIndex((x) => activeRoutes[x])
  const [_, update] = useState(0)

  return (
    <>
      {children.map((child, index) => {
        // todo not in loop
        const state =
          activeIndex === -1
            ? 'collect'
            : activeIndex === index
            ? 'active'
            : 'inactive'

        const contextValue = useMemo<RouteContextI>(() => {
          return {
            state,
            setRoute: (name, next) => {
              activeRoutes[name] = next
              setActiveRoutes(activeRoutes)
              update(Math.random())
            },
          }
        }, [state])

        return (
          <RouteContext.Provider key={index} value={contextValue}>
            <VStack
              width="100%"
              height="100%"
              display={index == -1 || activeIndex == index ? 'flex' : 'none'}
            >
              {child}
            </VStack>
          </RouteContext.Provider>
        )
      })}
    </>
  )
}

export function Route(props: { name: string; exact?: boolean; children: any }) {
  const om = useOvermind()
  const activeName = om.state.router.curPage.name
  // console.log(activeName)
  const routeContext = useContext(RouteContext)
  const isExactMatching = props.exact && activeName === props.name
  const routePath = routes[props.name].path
  const routePaths: string[] = Object.keys(routes).map((x) => routes[x].path)
  const childRouteNames = routePaths
    .filter((p) => p.indexOf(routePath) === 0)
    .map((path) => routePathToName[path])
  const isParentMatching = childRouteNames.some((x) => x === activeName)
  const isMatched = !!(isParentMatching || isExactMatching)

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

  if (routeContext?.state === 'collect') {
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
