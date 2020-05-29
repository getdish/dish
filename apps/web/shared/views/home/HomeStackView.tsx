import { PopoverShowContext, VStack, ZStack, useDebounceValue } from '@dish/ui'
import _ from 'lodash'
import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { drawerBorderRadius, searchBarHeight } from '../../constants'
import { HomeStateItemSimple } from '../../state/home'
import { useOvermind, useOvermindStatic } from '../../state/useOvermind'
import { ErrorBoundary } from '../ErrorBoundary'
import { useMediaQueryIsSmall } from './HomeViewDrawer'

export function HomeStackView<A extends HomeStateItemSimple>(props: {
  children: (a: A, isActive: boolean, index: number) => React.ReactNode
}) {
  const om = useOvermind()
  const breadcrumbs = om.state.home.breadcrumbStates
  const debounceItems = useDebounceValue(breadcrumbs, transitionDuration)
  const isRemoving = debounceItems.length > breadcrumbs.length
  const items = isRemoving ? debounceItems : breadcrumbs
  return (
    <ZStack fullscreen>
      {items.map((item, i) => {
        const isActive = i === items.length - 1
        const stackItemIndex = _.findLastIndex(
          om.state.home.states,
          (x) => x.id === item.id
        )
        return (
          <PopoverShowContext.Provider
            key={`${i}`}
            value={isActive == true ? null : false}
          >
            <HomeStackViewItem
              item={item}
              index={i}
              isActive={isActive}
              isRemoving={isActive && isRemoving}
            >
              <ErrorBoundary name={`HomeStackView.${item.type}`}>
                <Suspense
                  fallback={
                    <VStack width={200} height={200} backgroundColor="green" />
                  }
                >
                  {props.children(item as any, isActive, stackItemIndex)}
                </Suspense>
              </ErrorBoundary>
            </HomeStackViewItem>
          </PopoverShowContext.Provider>
        )
      })}
    </ZStack>
  )
}

const transitionDuration = 280

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
  const om = useOvermindStatic()
  const [isMounted, setIsMounted] = useState(false)
  const isSmall = useMediaQueryIsSmall()

  useEffect(() => {
    let tm = setTimeout(() => {
      setIsMounted(true)
    }, 50)
    return () => clearTimeout(tm)
  }, [])
  const onPress = useMemo(
    () => () => {
      om.actions.home.popTo(item.type)
    },
    []
  )

  const top = isSmall ? 0 : index * 10 + (index == 0 ? 0 : searchBarHeight + 5)
  const left = isSmall ? -3 : Math.max(0, index) * 7

  return (
    <div
      className={`animate-up ${isMounted && !isRemoving ? 'active' : ''}`}
      style={{
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <ZStack pointerEvents={isActive ? 'none' : 'auto'} fullscreen>
        <TouchableOpacity
          disabled={isActive}
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={onPress}
        >
          <ZStack
            // backgroundColor={index === 0 ? 'transparent' : 'white'}
            flex={1}
            zIndex={index}
            top={top}
            left={left}
            bottom={-(index * 5)}
            width="100%"
            {...(index !== 0 && {
              shadowColor: 'rgba(0,0,0,0.1)',
              shadowRadius: 15,
              shadowOffset: { width: 0, height: 2 },
            })}
            borderRadius={drawerBorderRadius}
            pointerEvents="auto"
            // overflow="hidden"
          >
            {children}
          </ZStack>
        </TouchableOpacity>
      </ZStack>
    </div>
  )
}
