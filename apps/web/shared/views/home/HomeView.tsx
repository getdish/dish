import React from 'react'

import HomeMap from './HomeMap'
import HomeViewHome from './HomeViewHome'
import { ZStack } from '../shared/Stacks'
import { useOvermind } from '../../state/om'

import SideMenu from 'react-native-side-menu'
import { Route } from '../shared/Route'
import { LabAuth } from '../auth'
import { HomeMenu } from './HomeMenu'
import { HomeViewDrawer } from './HomeViewDrawer'

export const HomeView = () => {
  const om = useOvermind()
  const showMenu = om.state.home.showMenu

  return (
    <SideMenu openMenuOffset={200} isOpen={showMenu} menu={<HomeMenu />}>
      <ZStack top={0} left={0} right={0} bottom={0}>
        <HomeMap />

        <HomeViewDrawer>
          <Route name="login">
            <LabAuth />
          </Route>
          <Route name="register">
            <LabAuth />
          </Route>
          <Route name="home">
            <HomeViewHome />
          </Route>
        </HomeViewDrawer>
      </ZStack>
    </SideMenu>
  )
}
