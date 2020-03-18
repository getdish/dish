import React, { useLayoutEffect } from 'react'
import { useOvermind } from '../../state/om'
import { HistoryItem, routes, routePathToName } from '../../state/router'

export function Route(props: {
  name: string
  exact?: boolean
  children: any
  forHistory?: HistoryItem
}) {
  const om = useOvermind()
  const curName = props.forHistory?.name ?? om.state.router.curPage.name

  if (props.exact) {
    if (curName === props.name) {
      return props.children
    }
    return null
  }

  // parent matching
  const routePath = routes[props.name].path
  const routePaths: string[] = Object.keys(routes).map(x => routes[x].path)
  const childRouteNames = routePaths
    .filter(p => p.indexOf(routePath) === 0)
    .map(path => routePathToName[path])

  if (childRouteNames.some(x => x === curName)) {
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
