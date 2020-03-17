import React from 'react'
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native'
import { ApolloProvider } from '@apollo/client'
import { createOvermind } from 'overmind'
import { Provider } from 'overmind-react'
import SideMenu from 'react-native-side-menu'

import { config, useOvermind } from './shared/state/om'
import { LabAuth } from './shared/views/auth'
import { LabHome } from './shared/views/home'
import { LabDishes } from './shared/views/dishes'
import { Route, PrivateRoute } from './shared/views/shared/Route'
import { Link } from './shared/views/shared/Link'

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
      <View>
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
          <View style={{ borderTopWidth: 1, marginTop: '1em' }}>
            <Text>
              {'\n'}Account{'\n\n'}
            </Text>
            <Link to="/" onClick={() => actions.auth.logout()}>
              Logout
            </Link>
            <Link to="/account/reviews">Reviews</Link>
          </View>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {state.auth.is_logged_in && state.auth.user.role == 'admin' && (
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
  const { state, actions } = useOvermind()
  actions.auth.checkForExistingLogin()
  return (
    <ApolloProvider client={state.auth.apollo_client}>
      <Content />
    </ApolloProvider>
  )
}

function Content() {
  const om = useOvermind()
  const menu = <MenuContents />
  const default_side_width = Dimensions.get('window').width * 0.66
  const side_menu_width = default_side_width > 300 ? 300 : default_side_width

  return (
    <SideMenu
      menu={menu}
      isOpen={om.state.showSidebar}
      onChange={isOpen => om.actions.setShowSidebar(isOpen)}
      openMenuOffset={side_menu_width}
      onPress={() => om.actions.setShowSidebar(false)}
    >
      <View style={styles.container}>
        <Route name="login">
          <LabAuth />
        </Route>
        <Route name="register">
          <LabAuth />
        </Route>
        <PrivateRoute name="taxonomy">
          <LabDishes />
        </PrivateRoute>
        <Route name="home">
          <LabHome />
        </Route>
      </View>
    </SideMenu>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
})
