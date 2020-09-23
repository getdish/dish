import { onGraphError } from '@dish/graph'
import { Toast } from '@dish/ui'
import React, { useEffect } from 'react'

import { AppPortalProvider } from './AppPortal'

export function AppRoot(props: { children: any }) {
  // graph errors to user
  // TODO report to us as well (sentry..)
  useEffect(() => {
    onGraphError((err) => {
      Toast.show(`${err}`, { type: 'error' })
    })
  }, [])

  return <AppPortalProvider>{props.children}</AppPortalProvider>
}
