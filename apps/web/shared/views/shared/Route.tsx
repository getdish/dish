import React, {
  useLayoutEffect,
  createContext,
  useMemo,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { useOvermind } from '../../state/om'
import { HistoryItem, routes, routePathToName } from '../../state/router'
import { View } from 'react-native'

const RouteContext = createContext<(name: string, showing: boolean) => void>(
  null
)

export function RouteSwitch(props: { children: any }) {
  const children = React.Children.toArray(props.children)
  const [val, setVal] = useState({})
  const names = children.map((x) => x['props'].name)
  const activeIndex = names.findIndex((x) => val[x])
  const [_, update] = useState(0)
  return children.map((child, index) => {
    const cb = useCallback((name, next) => {
      val[name] = next
      setVal(val)
      update(Math.random())
    }, [])
    return (
      <RouteContext.Provider key={index} value={cb}>
        <View
          style={{
            flex: 1,
            display: index == -1 || activeIndex == index ? 'flex' : 'none',
          }}
        >
          {child}
        </View>
      </RouteContext.Provider>
    )
  })
}

export function Route(props: {
  name: string
  exact?: boolean
  children: any
  forHistory?: HistoryItem
}) {
  const om = useOvermind()
  const activeName = props.forHistory?.name ?? om.state.router.curPage.name
  const setRouteInfo = useContext(RouteContext)
  const isExactMatching = props.exact && activeName === props.name
  const routePath = routes[props.name].path
  const routePaths: string[] = Object.keys(routes).map((x) => routes[x].path)
  const childRouteNames = routePaths
    .filter((p) => p.indexOf(routePath) === 0)
    .map((path) => routePathToName[path])
  const isParentMatching = childRouteNames.some((x) => x === activeName)

  const match = !!(isParentMatching || isExactMatching)
  useLayoutEffect(() => {
    if (!setRouteInfo) return
    setRouteInfo(props.name, match)
  }, [props.name, match])

  if (props.exact) {
    if (isExactMatching) {
      return props.children
    }
    return null
  }

  // parent matching
  if (isParentMatching) {
    return props.children
  }

  return null
}

export function PrivateRoute(props: { name: string; children: any }) {
  const om = useOvermind()
  const isLoggedIn = om.state.auth.is_logged_in
  const curPageName = om.state.router.curPage.name

  useLayoutEffect(() => {
    if (curPageName === props.name) {
      if (!isLoggedIn) {
        om.actions.router.navigate({ name: 'login' })
      }
    }
  }, [curPageName, isLoggedIn])

  if (isLoggedIn) {
    return <Route {...props} />
  }
  return null
}
