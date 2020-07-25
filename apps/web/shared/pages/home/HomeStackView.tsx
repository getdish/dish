import { AbsoluteVStack, VStack, useDebounceValue } from '@dish/ui'
import { cloneDeep } from 'lodash'
import React, { Suspense, memo, useMemo } from 'react'

import { memoize } from '../../helpers/memoizeWeak'
import { HomeStateItem, HomeStateItemSimple } from '../../state/home'
import { isSearchState } from '../../state/home-helpers'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { ErrorBoundary } from '../../views/ErrorBoundary'
import { getBreadcrumbs } from './getBreadcrumbs'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

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
  om.state.home.stateIds
  const stackItems = getBreadcrumbs(omStatic.state.home.states)
  const key = JSON.stringify(stackItems.map((x) => x.id))
  const homeStates = useMemo(() => stackItems, [key])
  const currentStates =
    useDebounceValue(homeStates, transitionDuration) ?? homeStates
  const isRemoving = currentStates.length > homeStates.length
  const items = isRemoving ? currentStates : homeStates

  // if (true) {
  //   console.log(
  //     'HomeStackView',
  //     cloneDeep({ isRemoving, states, homeStates, items })
  //   )
  // }

  return (
    <AbsoluteVStack fullscreen>
      {items.map((item, i) => {
        const isActive = i === items.length - 1
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
    const isSmall = useMediaQueryIsSmall()

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
      })
    }, [isActive, index, item])

    const className = `animate-up ${!isRemoving ? 'active' : ''}`
    console.log('className', className)

    return (
      // <PopoverContext.Provider value={useMemo(() => ({ id }), [id])}>
      <VStack
        className={className}
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
