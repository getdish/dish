import React from 'react'
import { ScrollView, View, Text } from 'react-native'
import { useOvermind } from '../../state/om'
import { LinkButton } from '../shared/Link'

export function HomeMenu() {
  const { state, actions } = useOvermind()
  const HomeMenuButton = props => <LinkButton padding={10} {...props} />
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

        <HomeMenuButton name="home">Home</HomeMenuButton>

        {state.auth.is_logged_in ? (
          <View>
            <Text>Account</Text>
            <HomeMenuButton name="home" onPress={() => actions.auth.logout()}>
              Logout
            </HomeMenuButton>
            <HomeMenuButton name="account" params={{ id: 'reviews' }}>
              Reviews
            </HomeMenuButton>
          </View>
        ) : (
          <>
            <HomeMenuButton name="login">Login</HomeMenuButton>
            <HomeMenuButton name="register">Register</HomeMenuButton>
          </>
        )}

        {state.auth.is_logged_in && state.auth.user.role == 'admin' && (
          <View>
            <Text>Admin</Text>
            <HomeMenuButton name="taxonomy">Taxonomy</HomeMenuButton>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
