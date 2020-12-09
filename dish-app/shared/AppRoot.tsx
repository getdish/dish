import React from 'react'

import { AppPortalProvider } from './AppPortal'

export function AppRoot(props: { children: any }) {
  return <AppPortalProvider>{props.children}</AppPortalProvider>
}
