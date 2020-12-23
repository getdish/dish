import React from 'react'
import { QueryClientProvider } from 'react-query'
import { ThemeProvider, configureThemes } from 'snackui'

import { AppPortalProvider } from './AppPortal'
import { queryClient } from './helpers/queryClient'
import themes, { MyTheme, MyThemes } from './themes'

declare module 'snackui' {
  interface ThemeObject extends MyTheme {}
  interface Themes extends MyThemes {}
}

configureThemes(themes)

export function AppRootProvider(props: { children: any }) {
  return (
    <ThemeProvider themes={themes} defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AppPortalProvider>{props.children}</AppPortalProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
