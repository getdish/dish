import { PopoverShowContext, VStack, ZStack, useDebounceValue } from '@dish/ui'
import _ from 'lodash'
import React, { Suspense, memo, useEffect, useMemo, useState } from 'react'

import { drawerBorderRadius } from '../../constants'
import { HomeStateItem, HomeStateItemSimple } from '../../state/home'
import { useOvermind, useOvermindStatic } from '../../state/useOvermind'
import { ErrorBoundary } from '../ErrorBoundary'
import { useMediaQueryIsSmall } from './HomeViewDrawer'

export function HomeStackView<A extends HomeStateItem>(props: {
  children: (a: A, isActive: boolean, index: number) => React.ReactNode
}) {
  const om = useOvermind()
  const breadcrumbs = om.state.home.breadcrumbStates
  const homeStates = useMemo(() => {
    return breadcrumbs
      .map((item) => {
        return om.state.home.states.find((x) => x.id === item.id)!
      })
      .filter(Boolean)
  }, [breadcrumbs])
  const states = useDebounceValue(homeStates, transitionDuration) ?? homeStates
  const isRemoving = states.length > breadcrumbs.length
  const items = isRemoving ? states : homeStates
  const key = `${items.map((x) => x.id).join(' ')}`
  const lastHomeStates = useMemo(() => om.state.home.states, [key])

  const itemChildren = useMemo(() => {
    return items.map((item, index) => {
      const stackItemIndex = _.findLastIndex(
        lastHomeStates,
        (x) => x.id === item.id
      )
      const homeItem = lastHomeStates[stackItemIndex] as A
      const isActive = index === items.length - 1
      return (
        <ErrorBoundary name={`HomeStackView.${item.type}`}>
          <Suspense fallback={null}>
            {props.children(homeItem, isActive, stackItemIndex)}
          </Suspense>
        </ErrorBoundary>
      )
    })
  }, [key])

  return (
    <ZStack fullscreen>
      {items.map((item, i) => {
        const isActive = i === items.length - 1
        return (
          <PopoverShowContext.Provider
            key={`${i}`}
            value={isActive == true ? null : false}
          >
            <HomeStackViewItem
              item={item}
              index={i}
              isActive={isActive}
              isRemoving={isRemoving && isActive}
            >
              {itemChildren[i]}
            </HomeStackViewItem>
          </PopoverShowContext.Provider>
        )
      })}
    </ZStack>
  )
}

const transitionDuration = 280

const HomeStackViewItem = memo(
  ({
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
  }) => {
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

    const top = isSmall ? 0 : index * (index == 0 ? 0 : 10)
    const left = isSmall ? -3 : Math.max(0, index) * 7

    return (
      <VStack
        className={`animate-up ${isMounted && !isRemoving ? 'active' : ''}`}
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        contain="layout"
      >
        <ZStack pointerEvents={isActive ? 'none' : 'auto'} fullscreen>
          <ZStack
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
          >
            {children}
          </ZStack>
        </ZStack>
      </VStack>
    )
  }
)
