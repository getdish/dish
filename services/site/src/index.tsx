import React, { Suspense } from 'react'
import { render } from 'react-dom'
import { ThemeProvider, configureThemes } from 'snackui'

import { App } from './App'
import themes, { MyTheme, MyThemes } from './themes'

declare module 'snackui' {
  interface ThemeObject extends MyTheme {}
  interface Themes extends MyThemes {}
}

configureThemes(themes)
render(<Root />, document.getElementById('root'))

function Root() {
  return (
    <ThemeProvider themes={themes} defaultTheme="light">
      <Suspense fallback={null}>
        <App />
      </Suspense>
    </ThemeProvider>
  )
}
