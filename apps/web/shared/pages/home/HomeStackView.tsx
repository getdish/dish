import { AbsoluteVStack, VStack, useDebounceValue } from '@dish/ui'
import { cloneDeep } from 'lodash'
import React, { Suspense, memo, useEffect, useMemo, useState } from 'react'

import { drawerBorderRadius } from '../../constants'
import { HomeStateItem, HomeStateItemSimple } from '../../state/home'
import { useOvermind } from '../../state/useOvermind'
import { ErrorBoundary } from '../../views/ErrorBoundary'
import { useMediaQueryIsSmall } from './HomeViewDrawer'

// export class HomeStateStore extends Store {
//   currentId = ''
// }

const transitionDuration = 280

export type StackItemProps<A> = {
  item: A
  isActive: boolean
  isRemoving: boolean
}

type GetChildren<A> = (props: StackItemProps<A>) => React.ReactNode

export function HomeStackView<A extends HomeStateItem>(props: {
  children: GetChildren<A>
}) {
  // const currentStateStore = useRecoilStore(HomeStateStore)
  const om = useOvermind()
  const breadcrumbs = om.state.home.breadcrumbStates
  const states = om.state.home.states
  const isInAdmin = om.state.router.curPage.name.startsWith('admin')
  const key = JSON.stringify([states, breadcrumbs])
  const homeStates = useMemo(() => {
    return breadcrumbs
      .map((item) => {
        return om.state.home.states.find((x) => x.id === item.id)!
      })
      .filter(Boolean)
  }, [key])
  const currentStates =
    useDebounceValue(homeStates, transitionDuration) ?? homeStates
  const isRemoving = currentStates.length > breadcrumbs.length
  const items = isRemoving ? currentStates : homeStates

  if (false) {
    console.log(
      'HomeStackView',
      cloneDeep({ isRemoving, states, breadcrumbs, homeStates, items })
    )
  }

  return (
    <AbsoluteVStack fullscreen>
      {items.map((item, i) => {
        const isActive = !isInAdmin && i === items.length - 1
        return (
          // <PopoverShowContext.Provider
          //   key={item.id}
          //   value={isActive == true ? null : false}
          // >
          <HomeStackViewItem
            key={item.id}
            item={item}
            index={i}
            isActive={isActive}
            isRemoving={isRemoving && isActive}
            getChildren={props.children as any}
          />
          // </PopoverShowContext.Provider>
        )
      })}
    </AbsoluteVStack>
  )
}

const HomeStackViewItem = memo(
  ({
    item,
    index,
    isActive,
    isRemoving,
    getChildren,
  }: {
    getChildren: GetChildren<HomeStateItem>
    item: HomeStateItemSimple
    index: number
    isActive: boolean
    isRemoving: boolean
  }) => {
    // const popoverStore = useRecoilStore(PopoverStore, { id })
    const [isMounted, setIsMounted] = useState(false)
    const isSmall = useMediaQueryIsSmall()

    useEffect(() => {
      let tm = setTimeout(() => {
        setIsMounted(true)
      }, 50)
      return () => clearTimeout(tm)
    }, [])

    const top = isSmall || index == 0 ? 0 : index * 5
    const left = isSmall ? 0 : Math.max(0, index) * 3

    // useEffect(() => {
    //   popoverStore.show = isActive
    // }, [isActive])

    const memoChildren = useMemo(() => {
      return getChildren({
        // @ts-ignore
        item,
        index,
        isActive,
        isRemoving,
      })
    }, [item])

    return (
      // <PopoverContext.Provider value={useMemo(() => ({ id }), [id])}>
      <VStack
        className={`animate-up ${isMounted && !isRemoving ? 'active' : ''}`}
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
      >
        <AbsoluteVStack pointerEvents={isActive ? 'none' : 'auto'} fullscreen>
          <AbsoluteVStack
            flex={1}
            zIndex={index}
            top={top}
            left={left}
            bottom={-(index * 5)}
            width="100%"
            borderRadius={drawerBorderRadius}
            pointerEvents="auto"
          >
            <ErrorBoundary name={`HomeStackView.${item.type}`}>
              <Suspense fallback={null}>{memoChildren}</Suspense>
            </ErrorBoundary>
          </AbsoluteVStack>
        </AbsoluteVStack>
      </VStack>
      // </PopoverContext.Provider>
    )
  }
)
