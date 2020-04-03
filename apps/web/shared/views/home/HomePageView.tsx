import { LinearGradient } from 'expo-linear-gradient'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { isWorker } from '../../constants'
import { useDebounceValue } from '../../hooks/useDebounce'
import {
  HomeStateItemHome,
  HomeStateItemRestaurant,
  HomeStateItemSearch,
  HomeStateItemSimple,
} from '../../state/home'
import { useOvermind } from '../../state/om'
import { ForceShowPopover } from '../shared/Popover'
import { VStack, ZStack } from '../shared/Stacks'
import { HomeControlsOverlay } from './HomeControlsOverlay'
import { HomeMap } from './HomeMap'
import HomeRestaurantView from './HomeRestaurantView'
import HomeSearchBar, { searchBarHeight } from './HomeSearchBar'
import HomeSearchResultsView from './HomeSearchResultsView'
import HomeViewTopDishes from './HomeViewTopDishes'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

export const drawerPad = 8
export const drawerBorderRadius = 10

export default () => {
  return (
    <ZStack top={0} left={0} right={0} bottom={0}>
      {!isWorker && <HomeMap />}
      <HomeControlsOverlay />
      <HomeSearchBar />
      <HomeViewDrawer>
        <HomeViewContent />
      </HomeViewDrawer>
    </ZStack>
  )
}

function HomeViewDrawer(props: { children: any }) {
  const drawerWidth = useHomeDrawerWidth()
  return (
    <VStack
      position={'absolute'}
      top={drawerPad}
      left={drawerPad}
      bottom={drawerPad}
      zIndex={10}
      width={drawerWidth}
      borderRadius={drawerBorderRadius}
      shadowColor="rgba(0,0,0,0.22)"
      shadowRadius={24}
      borderWidth={1}
      borderColor="rgba(255,255,255,0.6)"
      flex={1}
    >
      <ZStack fullscreen borderRadius={drawerBorderRadius} overflow="hidden">
        {/* <BlurView /> */}
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.3)',
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
            // 'rgba(255,255,255,0.8)',
            // 'rgba(255,255,255,0.6)',
          ]}
          style={[StyleSheet.absoluteFill]}
        />
      </ZStack>
      {props.children}
    </VStack>
  )
}

const HomeViewContent = memo(function HomeViewContent() {
  const om = useOvermind()
  const { breadcrumbStates } = om.state.home
  return (
    <>
      <ZStack position="relative" flex={1}>
        <VStack
          position="absolute"
          top={searchBarHeight}
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
                    <HomeViewTopDishes state={homeState as HomeStateItemHome} />
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
      <ZStack pointerEvents={isActive ? 'none' : 'auto'} fullscreen>
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
            top={index * 20}
            {...(index !== 0 && {
              shadowColor: 'rgba(0,0,0,0.15)',
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 2 },
            })}
            borderRadius={22}
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
