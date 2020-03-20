import React, { useState, useLayoutEffect } from 'react'
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native'
import { ApolloProvider } from '@apollo/client'
import { createOvermind, Overmind, Config } from 'overmind'
import { Provider } from 'overmind-react'

import { config, useOvermind, Om } from './shared/state/om'
import { HomeView } from './shared/views/home/HomeView'
import { LabDishes } from './shared/views/dishes'
import { Route, PrivateRoute } from './shared/views/shared/Route'
import { ZStack, VStack } from './shared/views/shared/Stacks'

const overmind = createOvermind(config)

export default function App() {
  return (
    <Provider value={overmind}>
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
      om.actions.auth.checkForExistingLogin()
      await om.actions.router.start({
        onRouteChange: ({ type, name, item }) => {
          console.log('onRouteChange', type, name, item)
          switch (name) {
            case 'home':
            case 'search':
            case 'restaurant':
              if (type === 'push') {
                om.actions.home._pushHomeState(item)
              } else {
                om.actions.home._popHomeState(item)
              }
              return
          }
        },
      })
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

function Splash() {
  return (
    <ZStack fullscreen backgroundColor="red">
      <Text>Loading</Text>
    </ZStack>
  )
}
