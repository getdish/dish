import './styles.scss'

import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import { LabMap } from './map'
import { config } from './overmind'

const overmind = createOvermind(config)

ReactDOM.render(<RootView />, document.getElementById('root'))

function RootView() {
  const [tab, setTab] = useState(0)

  return (
    <Provider value={overmind}>
      <button
        onClick={() => {
          setTab(0)
        }}
      >
        Map
      </button>
      <button
        onClick={() => {
          setTab(1)
        }}
      >
        Dishes
      </button>

      {tab == 0 && <LabMap />}
      {tab == 1 && <LabMap />}
    </Provider>
  )
}
