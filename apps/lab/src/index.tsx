import './styles.scss'

import { ProvideUI, themes } from '@o/ui'
import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import { LabDishes } from './dishes'
import { LabMap } from './map'
import { config } from './overmind'

const overmind = createOvermind(config)

ReactDOM.render(<RootView />, document.getElementById('root'))

function RootView() {
  const [tab, setTab] = useState(0)

  return (
    <ProvideUI themes={themes} activeTheme="light">
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
        {tab == 1 && <LabDishes />}
      </Provider>
    </ProvideUI>
  )
}
