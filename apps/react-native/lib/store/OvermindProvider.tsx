import React from 'react'
import ReactDOM from 'react-dom'
import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import { config } from './overmind'

const overmind = createOvermind(config)

export default (ViewComponent, /* { ssr = true } = {} */) => () => {
  return (
    <Provider value={overmind}>
      <ViewComponent />
    </Provider>
  )
}