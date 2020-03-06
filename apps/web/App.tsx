import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native'
import { ApolloProvider } from '@apollo/client'
import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
} from 'react-router-dom'
import SideMenu from 'react-native-side-menu'

import { config, useOvermind } from './shared/state/om'
import { LabAuth } from './shared/views/auth'
import { LabMap } from './shared/views/map'
import { LabDishes } from './shared/views/dishes'

const overmind = createOvermind(config)

export default function App() {
  return (
    <Provider value={overmind}>
      <StatefulApp />
    </Provider>
  )
}

function MenuContents() {
  const { state, actions } = useOvermind()
  return (
    <ScrollView>
      <View style={styles.menu}>
        {state.auth.is_logged_in ? (
          <Text>
            Logged in as {state.auth.user.username}
            {'\n\n'}
          </Text>
        ) : (
          <Text></Text>
        )}

        <Link to="/">Home</Link>

        {state.auth.is_logged_in ? (
          <Link onClick={() => actions.auth.logout()}>Logout</Link>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {state.auth.is_logged_in && (
          <View style={{ borderTopWidth: 1, marginTop: '1em' }}>
            <Text>
              {'\n'}Admin{'\n\n'}
            </Text>
            <Link to="/taxonomy">Taxonomy</Link>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

function StatefulApp() {
  const { state } = useOvermind()
  return (
    <ApolloProvider client={state.auth.apollo_client}>
      <Router>
        <Content />
      </Router>
    </ApolloProvider>
  )
}

function Content() {
  const [isOpen, setIsOpen] = useState(false)
  const menu = <MenuContents />
  const default_side_width = Dimensions.get('window').width * 0.66
  const side_menu_width = default_side_width > 300 ? 300 : default_side_width
  const history = useHistory()

  history.listen(() => setIsOpen(false))

  return (
    <SideMenu
      menu={menu}
      isOpen={isOpen}
      onChange={isOpen => setIsOpen(isOpen)}
      openMenuOffset={side_menu_width}
      onPress={() => setIsOpen(false)}
    >
      <View style={styles.container}>
        <Switch>
          <Route exact path="/">
            <LabMap />
          </Route>
          <Route path="/login">
            <LabAuth />
          </Route>
          <Route path="/register">
            <LabAuth />
          </Route>
          <PrivateRoute path="/taxonomy">
            <LabDishes />
          </PrivateRoute>
        </Switch>
      </View>
      <TouchableOpacity
        onPress={() => setIsOpen(!isOpen)}
        style={styles.button}
      >
        <Image
          source={require('./shared/assets/menu.png')}
          style={{ width: 32, height: 32 }}
        />
      </TouchableOpacity>
    </SideMenu>
  )
}

function PrivateRoute({ children, ...rest }) {
  const { state } = useOvermind()
  return (
    <Route
      {...rest}
      render={({ location }) =>
        state.auth.is_logged_in ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  menu: {
    padding: '3em',
    fontSize: 20,
  },
  button: {
    position: 'absolute',
    padding: 10,
  },
})

