import React from 'react'
import ReactDOM from 'react-dom'

import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import { config } from './overmind'

import Map from './Map'
import Sidebar from './Sidebar'

import './styles.scss'

const overmind = createOvermind(config)

ReactDOM.render(
  <Provider value={overmind}>
    <Map />
  </Provider>,
  document.getElementById('map')
)

ReactDOM.render(
  <Provider value={overmind}>
    <Sidebar />
  </Provider>,
  document.getElementById('root')
)
