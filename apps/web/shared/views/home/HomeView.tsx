import React, { useState, useEffect } from 'react'

import HomeMap from './HomeMap'
import HomeViewHome, { drawerBorderRadius } from './HomeViewHome'
import { ZStack, VStack, HStack, StackBaseProps } from '../shared/Stacks'
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableOpacityProps,
} from 'react-native'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useOvermind } from '../../state/om'
import { Link, DishButton } from '../shared/Link'
import { SimpleLineIcons } from '@expo/vector-icons'

import CardFlip from 'react-native-card-flip'
import { Route } from '../shared/Route'
import { LabAuth } from '../auth'
import { BlurView } from './BlurView'
import { Spacer } from '../shared/Spacer'

export function useHomeDrawerWidth(): number {
  const [width] = useWindowSize({ throttle: 100 })
  return Math.min(Math.max(400, width * 0.5), 600)
}

export const HomeView = () => {
  const om = useOvermind()
  const drawerWidth = useHomeDrawerWidth()
  const showMenu = om.state.home.showMenu
  const [card, setCard] = useState(null)

  useEffect(() => {
    if (!card) return
    card.flip()
  }, [showMenu])

  return (
    <ZStack top={0} left={0} right={0} bottom={0}>
      <HomeMap />

      <View
        style={[
          styles.container,
          {
            width: drawerWidth,
          },
        ]}
      >
        <CardFlip
          ref={x => setCard(x)}
          style={{ width: drawerWidth, height: '100%' }}
        >
          <DrawerContainer>
            <Route name="login">
              <LabAuth />
            </Route>
            <Route name="register">
              <LabAuth />
            </Route>
            <Route name="home">
              <HomeViewHome />
            </Route>
          </DrawerContainer>
          <DrawerContainer>
            <MenuContents />
          </DrawerContainer>
        </CardFlip>
      </View>
    </ZStack>
  )
}

function DrawerContainer(props: { children: any }) {
  return (
    <View style={styles.drawer}>
      <ZStack fullscreen borderRadius={drawerBorderRadius} overflow="hidden">
        <BlurView />
      </ZStack>

      <HomeDrawerHeader />

      {props.children}
    </View>
  )
}

function HomeDrawerHeader() {
  const om = useOvermind()

  return (
    <VStack
      paddingVertical={12}
      paddingHorizontal={18}
      alignItems="center"
      justifyContent="center"
    >
      <HStack
        position="absolute"
        top={0}
        right={12}
        left={12}
        bottom={0}
        alignItems="center"
        zIndex={1000}
        pointerEvents="none"
        justifyContent="center"
      >
        <DishButton
          onPress={() => om.actions.home.setShowMenu(!om.state.home.showMenu)}
        >
          <SimpleLineIcons name="user" size={22} style={{ opacity: 0.5 }} />
        </DishButton>

        <Spacer flex />

        {/* <Button>
          <SimpleLineIcons name="user" size={22} style={{ opacity: 0.5 }} />
        </Button> */}
      </HStack>

      <HStack>
        <Spacer flex />

        <TouchableOpacity
          onPress={() => {
            om.actions.home.setSearchQuery('')
            om.actions.router.navigate({ name: 'home' })
          }}
        >
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 1211 * 0.065, height: 605 * 0.065 }}
          />
        </TouchableOpacity>

        <Spacer flex />
      </HStack>
    </VStack>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    bottom: 20,
    zIndex: 10,
  },
  drawer: {
    borderRadius: drawerBorderRadius,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    flex: 1,
  },
})

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

        <Link name="home">Home</Link>

        {state.auth.is_logged_in ? (
          <View style={{ borderTopWidth: 1, marginTop: '1em' }}>
            <Text>Account</Text>
            <Link name="home" onClick={() => actions.auth.logout()}>
              Logout
            </Link>
            <Link name="account" params={{ id: 'reviews' }}>
              Reviews
            </Link>
          </View>
        ) : (
          <>
            <Link name="login">Login</Link>
            <Link name="register">Register</Link>
          </>
        )}

        {state.auth.is_logged_in && state.auth.user.role == 'admin' && (
          <View style={{ borderTopWidth: 1, marginTop: '1em' }}>
            <Text>Admin</Text>
            <Link name="taxonomy">Taxonomy</Link>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
