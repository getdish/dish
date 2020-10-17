import { HasuraError, onGraphError } from '@dish/graph'
import React, { useEffect } from 'react'
import { Toast } from 'snackui'

import { AppPortalProvider } from './AppPortal'

export function AppRoot(props: { children: any }) {
  // graph errors to user
  // TODO report to us as well (sentry..)
  useEffect(() => {
    onGraphError((e) => {
      Toast.show(`${e.errors.map((x) => x.message).join(',')}`, {
        type: 'error',
      })
    })
  }, [])

  return <AppPortalProvider>{props.children}</AppPortalProvider>
}
