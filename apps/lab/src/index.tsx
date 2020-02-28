import './styles.scss'

import { ApolloProvider } from '@apollo/client'
import { ModelBase } from '@dish/models'
import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import { LabMap } from './map'
import { config } from './overmind'

const overmind = createOvermind(config)

ReactDOM.render(<RootView />, document.getElementById('app'))

function RootView() {
  const [tab, setTab] = useState(0)

  return (
    <ApolloProvider client={ModelBase.client}>
      <Provider value={overmind}>
        <div>
          <div>
            <button
              onClick={() => {
                setTab(1)
              }}
            >
              Map
            </button>
          </div>

          {tab === 1 && <LabMap />}
        </div>
      </Provider>
    </ApolloProvider>
  )
}
