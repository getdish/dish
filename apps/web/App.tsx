import React, { useState, useLayoutEffect } from 'react'
import { Dimensions } from 'react-native'
import { ApolloProvider } from '@apollo/client'
import { Provider } from 'overmind-react'

import { useOvermind, Om, om, startOm } from './shared/state/om'
import { HomeView } from './shared/views/home/HomeView'
import { LabDishes } from './shared/views/dishes'
import { Route, PrivateRoute } from './shared/views/shared/Route'
import { Splash } from './Splash'

// global styles
import './App.css'

export default function App() {
  return (
    <Provider value={om}>
      <StatefulApp />
    </Provider>
  )
}

function StatefulApp() {
  const [started, setIsStarted] = useState(false)
  const om = useOvermind()

  // start app!
  useLayoutEffect(() => {
    async function start() {
      await Promise.all([startOm(om as any), startMapKit()])
      setIsStarted(true)
    }
    start()
  }, [])

  if (!started) {
    return <Splash />
  }

  return (
    <ApolloProvider client={om.state.auth.apollo_client}>
      <PrivateRoute name="taxonomy">
        <LabDishes />
      </PrivateRoute>
      <Route name="home">
        <HomeView />
      </Route>
    </ApolloProvider>
  )
}

async function startMapKit() {
  const token = `eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkwzQ1RLNTYzUlQifQ.eyJpYXQiOjE1ODQ0MDU5MzYuMjAxLCJpc3MiOiIzOTlXWThYOUhZIn0.wAw2qtwuJkcL6T6aI-nLZlVuwJZnlCNg2em6V1uopx9hkUgWZE1ISAWePMoRttzH_NPOem4mQfrpmSTRCkh2bg`
  // init mapkit
  mapkit.init({
    authorizationCallback: (done) => {
      done(token)
    },
  })
}
