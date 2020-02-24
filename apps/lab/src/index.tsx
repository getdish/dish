import './styles.scss'

import { ApolloProvider } from '@apollo/client'
import { ModelBase } from '@dish/models'
import { Button, ProvideUI, Stack, themes } from '@o/ui'
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
          <Stack height="100vh" overflow="hidden">
            <Stack direction="horizontal">
              <Button
                onClick={() => {
                  setTab(0)
                }}
              >
                Dishes
              </Button>

              <Button
                onClick={() => {
                  setTab(1)
                }}
              >
                Map
              </Button>
            </Stack>

            {tab == 1 && <LabMap />}
            {tab == 0 && <LabDishes />}
          </Stack>
        </Provider>
      </ProvideUI>
    </ApolloProvider>
  )
}
