import React, { useEffect } from 'react'
import { useOvermind } from '../../state/om'

export function Route(props: { name: string; children: any }) {
  const om = useOvermind()
  if (om.state.router.curPage.name == name) {
    return props.children
  }
  return null
}

export function PrivateRoute(props: { name: string; children: any }) {
  const om = useOvermind()
  const isLoggedIn = om.state.auth.is_logged_in

  useEffect(() => {
    if (!isLoggedIn) {
      om.actions.router.navigate('/login')
    }
  }, [isLoggedIn])

  if (isLoggedIn) {
    return <Route {...props} />
  }
  return null
}
