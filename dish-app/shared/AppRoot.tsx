import React from 'react'
import { QueryClientProvider } from 'react-query'

import { AppPortalProvider } from './AppPortal'
import { queryClient } from './helpers/queryClient'

export function AppRoot(props: { children: any }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppPortalProvider>{props.children}</AppPortalProvider>
    </QueryClientProvider>
  )
}
