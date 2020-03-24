import React, { memo } from 'react'
import { ScrollView, View, Text } from 'react-native'
import { useOvermind } from '../../state/om'
import { LinkButton } from '../shared/Link'

export default memo(function HomeMenu() {
  const om = useOvermind()
  const HomeMenuButton = (props) => (
    <LinkButton
      onPress={() => {
        om.actions.home.setShowMenu(false)
      }}
      padding={10}
      {...props}
    />
  )
  return (
    <ScrollView>
      <View>
        {om.state.auth.is_logged_in ? (
          <Text>
            Logged in as {om.state.auth.user.username}
            {'\n\n'}
          </Text>
        ) : (
          <Text></Text>
        )}

        <HomeMenuButton name="home">Home</HomeMenuButton>

        {om.state.auth.is_logged_in ? (
          <View>
            <Text>Account</Text>
            <HomeMenuButton
              name="home"
              onPress={() => om.actions.auth.logout()}
            >
              Logout
            </HomeMenuButton>
            <HomeMenuButton
              name="account"
              params={{ id: 'reviews', pane: 'list' }}
            >
              Reviews
            </HomeMenuButton>
          </View>
        ) : (
          <>
            <HomeMenuButton name="login">Login</HomeMenuButton>
            <HomeMenuButton name="register">Register</HomeMenuButton>
          </>
        )}

        {om.state.auth.is_logged_in && om.state.auth.user.role == 'admin' && (
          <View>
            <Text>Admin</Text>
            <HomeMenuButton name="taxonomy">Taxonomy</HomeMenuButton>
          </View>
        )}
      </View>
    </ScrollView>
  )
})
