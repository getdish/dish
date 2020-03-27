import React, { memo, useState, useEffect, useMemo } from 'react'

import HomeMap from './HomeMap'
import { useOvermind } from '../../state/om'

import SideMenu from 'react-native-side-menu'
import { Route, RouteSwitch } from '../shared/Route'
import HomeMenu from './HomeMenu'

import HomeRestaurantView from './HomeRestaurantView'
import HomeViewTopDishes from './HomeViewTopDishes'
import HomeSearchResultsView from './HomeSearchResultsView'
import HomeSearchBar from './HomeSearchBar'
import { VStack, ZStack } from '../shared/Stacks'
import {
  HomeStateItemSimple,
  HomeStateItemSearch,
  HomeStateItemRestaurant,
} from '../../state/home'
import _ from 'lodash'
import HomeFilterBar from './HomeFilterBar'
import { LinearGradient } from 'expo-linear-gradient'
import { TouchableOpacity, Animated, Text } from 'react-native'

import { StyleSheet, View } from 'react-native'
import { useWindowSize } from '../../hooks/useWindowSize'
import { useDebounceValue } from '../../hooks/useDebounce'
import { ForceShowPopover } from '../shared/Popover'
import { HomeControlsOverlay } from './HomeControlsOverlay'
import { BlurView } from '../shared/BlurView'

export function useHomeDrawerWidth(): number {
  const [width] = useWindowSize({ throttle: 200 })
  return Math.min(Math.max(500, width * 0.55), 620)
}

export const HomeView = () => {
  const om = useOvermind()
  const showMenu = om.state.home.showMenu

  return (
    <SideMenu openMenuOffset={200} isOpen={showMenu} menu={<HomeMenu />}>
      <ZStack top={0} left={0} right={0} bottom={0}>
        <HomeMap />
        <HomeControlsOverlay />
        <HomeViewDrawer>
          <RouteSwitch>
            <Route name="home">
              <HomeViewContent />
            </Route>
          </RouteSwitch>
        </HomeViewDrawer>
      </ZStack>
    </SideMenu>
  )
}

function HomeViewDrawer(props: { children: any }) {
  const drawerWidth = useHomeDrawerWidth()
  return (
    <VStack
      position={'absolute'}
      top={20}
      left={23}
      bottom={15}
      zIndex={10}
      width={drawerWidth}
      borderRadius={drawerBorderRadius}
      shadowColor="rgba(0,0,0,0.22)"
      shadowRadius={24}
      borderWidth={1}
      borderColor="#fff"
      flex={1}
    >
      <ZStack fullscreen borderRadius={drawerBorderRadius} overflow="hidden">
        {/* <BlurView /> */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.6)',
            'rgba(255,255,255,1)',
            'rgba(255,255,255,1)',
            'rgba(255,255,255,1)',
          ]}
          style={[StyleSheet.absoluteFill]}
        />
      </ZStack>
      {props.children}
    </VStack>
  )
}

export const drawerBorderRadius = 18

const HomeViewContent = memo(function HomeViewContent() {
  const om = useOvermind()
  const { breadcrumbStates } = om.state.home
  return (
    <>
      <HomeSearchBar />
      {/* <HomeFilterBar /> */}
      <ZStack position="relative" flex={1}>
        <VStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          flex={1}
        >
          <HomeStackView items={breadcrumbStates}>
            {(homeState) => {
              return (
                <>
                  {homeState.type == 'home' && (
                    <HomeViewTopDishes state={homeState} />
                  )}
                  {homeState.type == 'search' && (
                    <HomeSearchResultsView
                      state={homeState as HomeStateItemSearch}
                    />
                  )}
                  {homeState.type == 'restaurant' && (
                    <HomeRestaurantView
                      state={homeState as HomeStateItemRestaurant}
                    />
                  )}
                </>
              )
            }}
          </HomeStackView>
        </VStack>
      </ZStack>
    </>
  )
})

function HomeStackView<A extends HomeStateItemSimple>({
  items,
  children,
}: {
  items: A[]
  children: (a: A, isActive: boolean, index: number) => React.ReactNode
}) {
  const debounceItems = useDebounceValue(items, 60)

  return (
    <ZStack fullscreen>
      {debounceItems.map((item, index) => {
        const isActive = index === debounceItems.length - 1
        return (
          <ForceShowPopover.Provider
            key={`${index}`}
            value={isActive == true ? undefined : false}
          >
            <HomeStackViewItem
              item={item}
              index={index}
              total={debounceItems.length}
            >
              {children(item as any, isActive, index)}
            </HomeStackViewItem>
          </ForceShowPopover.Provider>
        )
      })}
    </ZStack>
  )
}

function HomeStackViewItem({
  children,
  item,
  index,
  total,
}: {
  children: React.ReactNode
  item: HomeStateItemSimple
  index: number
  total: number
}) {
  const om = useOvermind()
  const isTop = index === total - 1
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    let tm = setTimeout(() => {
      setIsMounted(true)
    }, 50)
    return () => clearTimeout(tm)
  }, [])

  const onPress = useMemo(
    () => () => {
      om.actions.home.popTo(item as any)
    },
    []
  )

  return (
    <div className={`animate-up ${isMounted ? 'active' : ''}`}>
      <style>
        {`
.animate-up {
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  pointer-events: none;
  transform: translateY(20px);
  transition: all ease-in-out 250ms;
}
.animate-up.active {
  opacity: 1;
  transform: translateY(0);
}
        `}
      </style>
      <ZStack
        // animation="fadeInUp"
        // duration={300}
        pointerEvents={isTop ? 'none' : 'auto'}
        fullscreen
      >
        <TouchableOpacity
          disabled={isTop}
          style={{ flex: 1 }}
          onPress={onPress}
        >
          <ZStack
            backgroundColor={index === 0 ? 'transparent' : 'white'}
            fullscreen
            flex={1}
            zIndex={index}
            top={index * 25}
            {...(index !== 0 && {
              shadowColor: 'rgba(0,0,0,0.2)',
              shadowRadius: 4,
            })}
            borderRadius={drawerBorderRadius}
            pointerEvents="auto"
            overflow="hidden"
          >
            {children}
          </ZStack>
        </TouchableOpacity>
      </ZStack>
    </div>
  )
}
