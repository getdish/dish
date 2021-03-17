import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { SiteRoot } from './SiteRoot'

export function render() {
  const RootNode = document.querySelector('#app')
  // after configurations

  if (process.env.NODE_ENV === 'development') {
    if (window.location.search.indexOf('why') > -1) {
      const whyDidYouRender = require('@welldone-software/why-did-you-render').default
      const React = require('react')
      whyDidYouRender(React, {
        // turn on to log ONLY when things rendered without needing to
        // logOnDifferentValues: true,
        include: [
          // everything:
          // /[A-Z][a-zA-Z]+/
          // /Docs|Home|Header|Orbit|Page|Layout|Page/,
        ],
        // seems like classes dont work (transpiled probably similar to error: https://github.com/maicki/why-did-you-update/issues/47)
        exclude: [
          /^(ErrorBoundary|Sidebar|Interactive|Portal|Text|Popover|SuspenseWithBanner|ItemMeasurer|VirtualListItemInner|SortableGridItem|TimeAgo|Join)$/,
        ],
      })
    }
  }

  if (window.location.search.indexOf('react.concurrent') > 0) {
    // @ts-ignore
    ReactDOM.unstable_createRoot(RootNode).render(<SiteRoot />)
  } else {
    ReactDOM.render(<SiteRoot />, RootNode)
  }
}

render()
window['rerender'] = render

process.env.NODE_ENV === 'development' && module['hot'] && module['hot'].accept()
