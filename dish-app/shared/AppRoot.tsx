import { HasuraError, onGraphError } from '@dish/graph'
import { Toast } from '@dish/ui'
import React, { useEffect } from 'react'

import { AppPortalProvider } from './AppPortal'

export function AppRoot(props: { children: any }) {
  // graph errors to user
  // TODO report to us as well (sentry..)
  useEffect(() => {
    onGraphError((e) => {
      Toast.show(`${e.errors}`, { type: 'error' })
    })
  }, [])

  return <AppPortalProvider>{props.children}</AppPortalProvider>
}
