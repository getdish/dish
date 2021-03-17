import { createBrowserNavigation, lazy, mount, route } from 'navi'
import React from 'react'

import { HomePage } from './pages/HomePage'
import { routeTable } from './routeTable'

// window for hmr preservation

export const Navigation = createBrowserNavigation({
  routes: mount({
    '/': route({
      title: 'Orbit',
      view: <HomePage />,
    }),
    // wrap routes in lazy
    ...Object.keys(routeTable).reduce((acc, key) => {
      acc[key] = lazy(routeTable[key])
      return acc
    }, {}),
  }),
})

// google analytics

const gtag = window['gtag']
const gevent = obj => {
  console.debug('analytics', window['gid'], obj)
  gtag('config', window['gid'], obj)
}

Navigation.subscribe(next => {
  if (next.type === 'ready') {
    gevent({
      page_title: next.title,
      page_path: next.url.pathname,
    })
  }
})

// WARNING we had crazy circular dependencies
window['Navigation'] = Navigation
window['routeTable'] = routeTable
