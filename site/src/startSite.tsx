import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { SiteRoot } from './SiteRoot'

export function render() {
  const RootNode = document.querySelector('#app')
  // after configurations

  if (window.location.search.indexOf('react.concurrent') > 0) {
    // @ts-ignore
    ReactDOM.unstable_createRoot(RootNode).render(<SiteRoot />)
  } else {
    ReactDOM.render(<SiteRoot />, RootNode)
  }
}

render()
window['rerender'] = render

process.env.NODE_ENV === 'development' &&
  module['hot'] &&
  module['hot'].accept()
