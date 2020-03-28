import React, { memo, useState, useEffect, useMemo } from 'react'

import HomeMap from './HomeMap'
import { useOvermind } from '../../state/om'

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
import { useDebounceValue } from '../../hooks/useDebounce'
import { ForceShowPopover } from '../shared/Popover'
import { HomeControlsOverlay } from './HomeControlsOverlay'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

export const HomeView = () => {
  const om = useOvermind()

  return (
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
  )
}

function HomeViewDrawer(props: { children: any }) {
  const drawerWidth = useHomeDrawerWidth()
  return (
    <VStack
      position={'absolute'}
      top={15}
      left={20}
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
            'rgba(255,255,255,0.4)',
            'rgba(255,255,255,0.6)',
            'rgba(255,255,255,1)',
            'rgba(255,255,255,1)',
            'rgba(255,255,255,1)',
            'rgba(255,255,255,1)',
            'rgba(255,255,255,1)',
            'rgba(255,255,255,1)',
            'rgba(255,255,255,1)',
            'rgba(255,255,255,1)',
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

export const drawerBorderRadius = 40

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

const transitionDuration = 280

function HomeStackView<A extends HomeStateItemSimple>(props: {
  items: A[]
  children: (a: A, isActive: boolean, index: number) => React.ReactNode
}) {
  const debounceItems = useDebounceValue(props.items, transitionDuration)
  const isRemoving = debounceItems.length > props.items.length
  const items = isRemoving ? debounceItems : props.items
  return (
    <ZStack fullscreen>
      {items.map((item, index) => {
        const isActive = index === items.length - 1
        return (
          <ForceShowPopover.Provider
            key={`${index}`}
            value={isActive == true ? undefined : false}
          >
            <HomeStackViewItem
              item={item}
              index={index}
              isActive={isActive}
              isRemoving={isActive && isRemoving}
            >
              {props.children(item as any, isActive, index)}
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
  isActive,
  isRemoving,
}: {
  children: React.ReactNode
  item: HomeStateItemSimple
  index: number
  isActive: boolean
  isRemoving: boolean
}) {
  const om = useOvermind()
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
    <div className={`animate-up ${isMounted && !isRemoving ? 'active' : ''}`}>
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
  transition: all ease-in-out ${transitionDuration}ms;
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
        pointerEvents={isActive ? 'none' : 'auto'}
        fullscreen
      >
        <TouchableOpacity
          disabled={isActive}
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
            borderRadius={drawerBorderRadius / 2}
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
