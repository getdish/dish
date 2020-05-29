import 'jsdom-global/register'
import 'mutationobserver-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

export { default as TestRenderer } from 'react-test-renderer'

global['React'] = React
global['ReactDOM'] = ReactDOM
global['MutationObserver'] = global['window']['MutationObserver']
