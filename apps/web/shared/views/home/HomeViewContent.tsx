import './HomeViewContent.css'

import React, { memo, useEffect, useMemo, useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { searchBarHeight } from '../../constants'
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
import HomeRestaurantView from './HomeRestaurantView'
import HomeSearchResultsView from './HomeSearchResultsView'
import HomeViewTopDishes from './HomeViewTopDishes'

export const HomeViewContent = memo(function HomeViewContent() {
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
      <ZStack pointerEvents={isActive ? 'none' : 'auto'} fullscreen>
        <TouchableOpacity
          disabled={isActive}
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={onPress}
        >
          <ZStack
            backgroundColor={index === 0 ? 'transparent' : 'white'}
            flex={1}
            zIndex={index}
            top={index * 15}
            left={index * 10}
            bottom={-(index * 5)}
            width="100%"
            {...(index !== 0 && {
              shadowColor: 'rgba(0,0,0,0.15)',
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
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
