import './styles.scss'

import { ApolloProvider } from '@apollo/client'
import { Button, ProvideUI, Stack, themes } from '@o/ui'
import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import { LabDishes } from './dishes'
import { LabAuth } from './auth'
import { LabMap } from './map'
import { config, useOvermind } from './overmind'

const overmind = createOvermind(config)

ReactDOM.render(<RootView />, document.getElementById('app'))

function Authenticated() {
  const [tab, setTab] = useState(0)
  const { state, actions } = useOvermind()

  return (
    <ApolloProvider client={state.auth.apollo_client}>
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
          <span className="auth_menu">
            {state.auth.user.username + ' | '}{' '}
            <a
              onClick={() => {
                actions.auth.logout()
              }}
            >
              Logout
            </a>
          </span>
        </Stack>
        {tab == 1 && <LabMap />}
        {tab == 0 && <LabDishes />}
      </Stack>
    </ApolloProvider>
  )
}

function Main() {
  const { state } = useOvermind()
  return state.auth.is_logged_in ? <Authenticated /> : <LabAuth />
}

function RootView() {
  return (
    <ProvideUI themes={themes} activeTheme="light">
      <Provider value={overmind}>
        <Main />
      </Provider>
    </ProvideUI>
  )
}
