import './styles.scss'

import { ApolloProvider } from '@apollo/client'
import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import React, { useState } from 'react'
import ReactDOM from 'react-dom'

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

          <span className="auth_menu">
            {state.auth.user.username + ' | '}{' '}
            <button
              onClick={() => {
                actions.auth.logout()
              }}
            >
              Logout
            </button>
          </span>
        </div>
      </Provider>
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
