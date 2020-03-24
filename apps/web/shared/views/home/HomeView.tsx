import React, { memo } from 'react'

import HomeMap from './HomeMap'
import { useOvermind } from '../../state/om'

import SideMenu from 'react-native-side-menu'
import { Route } from '../shared/Route'
import { LabAuth } from '../auth'
import { HomeMenu } from './HomeMenu'

import * as Animatable from 'react-native-animatable'
import HomeRestaurantView from './HomeRestaurantView'
import HomeViewTopDishes from './HomeViewTopDishes'
import HomeSearchResultsView from './HomeSearchResultsView'
import HomeSearchBar from './HomeSearchBar'
import { Spacer } from '../shared/Spacer'
import { VStack, ZStack, StackBaseProps, HStack } from '../shared/Stacks'
import { HomeBreadcrumbs } from './HomeBreadcrumbs'
import { HomeStateItem } from '../../state/home'
import _ from 'lodash'
import HomeFilterBar from './HomeFilterBar'
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity } from 'react-native'

import { StyleSheet, View } from 'react-native'
import { useWindowSize } from '../../hooks/useWindowSize'
import { HomeDrawerHeader } from './HomeDrawerHeader'

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
            <HomeViewContent />
          </Route>
        </HomeViewDrawer>
      </ZStack>
    </SideMenu>
  )
}

export function HomeViewDrawer(props: { children: any }) {
  const drawerWidth = useHomeDrawerWidth()
  return (
    <View
      style={[
        {
          position: 'absolute',
          top: 15,
          left: 25,
          bottom: 15,
          zIndex: 10,
          width: drawerWidth,
          borderRadius: drawerBorderRadius,
          shadowColor: 'rgba(0,0,0,0.25)',
          shadowRadius: 24,
          backgroundColor: 'rgba(250,250,250,0.8)',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.5)',
          flex: 1,
        },
      ]}
    >
      {/* <ZStack fullscreen borderRadius={drawerBorderRadius} overflow="hidden">
        <BlurView />
      </ZStack> */}
      <HomeDrawerHeader />
      {props.children}
    </View>
  )
}

export function useHomeDrawerWidth(): number {
  const [width] = useWindowSize({ throttle: 100 })
  return Math.min(Math.max(400, width * 0.5), 600)
}

export const drawerBorderRadius = 20

const HomeViewContent = memo(function HomeViewContent() {
  const om = useOvermind()
  const { breadcrumbStates } = om.state.home
  return (
    <>
      <HomeSearchBar />
      <HomeFilterBar />
      <ZStack position="relative" flex={1}>
        <VStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          flex={1}
          paddingVertical={20}
        >
          <HomeStackView items={breadcrumbStates}>
            {(homeState) => {
              return (
                <>
                  {homeState.type == 'home' && (
                    <HomeViewTopDishes state={homeState} />
                  )}
                  {homeState.type == 'search' && (
                    <HomeSearchResultsView state={homeState} />
                  )}
                  {homeState.type == 'restaurant' && (
                    <HomeRestaurantView state={homeState} />
                  )}
                </>
              )
            }}
          </HomeStackView>
        </VStack>

        <ZStack fullscreen pointerEvents="none">
          <VStack flex={1}>
            <Spacer flex={1} />

            <HStack
              paddingVertical={20}
              paddingHorizontal={20}
              paddingTop={30}
              borderRadius={drawerBorderRadius}
              overflow="hidden"
            >
              <LinearGradient
                colors={['transparent', '#fff', '#fff']}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  zIndex: -1,
                }}
              />

              <VStack pointerEvents="auto">
                <HomeBreadcrumbs />
              </VStack>
            </HStack>
          </VStack>
        </ZStack>
      </ZStack>
    </>
  )
})

function HomeStackView<A extends HomeStateItem>({
  items,
  children,
}: {
  items: A[]
  children: (a: A, isActive: boolean, index: number) => React.ReactNode
}) {
  const om = useOvermind()
  return (
    <ZStack fullscreen>
      {items.map((x, index) => {
        const item = (x as any) as HomeStateItem
        const key = `${index}`
        const isTop = index === items.length - 1
        const contents = children(
          item as any,
          index === items.length - 1,
          index
        )
        return (
          <Animatable.View
            key={key}
            animation="fadeInUp"
            pointerEvents={isTop ? 'none' : 'auto'}
            duration={300}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            <TouchableOpacity
              disabled={isTop}
              style={{ flex: 1 }}
              onPress={() => {
                om.actions.home.popTo(x)
              }}
            >
              <ZStack
                backgroundColor="white"
                fullscreen
                flex={1}
                zIndex={index}
                top={index * 20}
                shadowColor="rgba(0,0,0,0.2)"
                shadowRadius={7}
                borderRadius={drawerBorderRadius}
                pointerEvents="auto"
                // overflow="hidden"
              >
                {contents}
              </ZStack>
            </TouchableOpacity>
          </Animatable.View>
        )
      })}
    </ZStack>
  )
}
