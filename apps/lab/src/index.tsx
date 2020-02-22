import './styles.scss'

import { ApolloProvider } from '@apollo/client'
import { ModelBase } from '@dish/models'
import { ProvideUI, Stack, themes } from '@o/ui'
import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import { LabDishes } from './dishes'
import { LabMap } from './map'
import { config } from './overmind'

const overmind = createOvermind(config)

ReactDOM.render(<RootView />, document.getElementById('app'))

function RootView() {
  const [tab, setTab] = useState(0)

  return (
    <ApolloProvider client={ModelBase.client}>
      <ProvideUI themes={themes} activeTheme="light">
        <Provider value={overmind}>
          <Stack direction="horizontal">
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
          </Stack>

          {tab == 0 && <LabMap />}
          {tab == 1 && <LabDishes />}
        </Provider>
      </ProvideUI>
    </ApolloProvider>
  )
}
