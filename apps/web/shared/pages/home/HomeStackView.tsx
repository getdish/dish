import { AbsoluteVStack, VStack, useDebounceValue } from '@dish/ui'
import React, { Suspense, memo, useMemo } from 'react'

import { searchBarHeight } from '../../constants'
import { HomeStateItem, HomeStateItemSimple } from '../../state/home-types'
import { omStatic, useOvermind } from '../../state/om'
import { ErrorBoundary } from '../../views/ErrorBoundary'
import { getBreadcrumbs } from './getBreadcrumbs'
import { useLastValueWhen } from './useLastValueWhen'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

// export class HomeStateStore extends Store {
//   currentId = ''
// }

export type StackItemProps<A> = {
  item: A
  index: number
  isActive: boolean
}

type GetChildren<A> = (props: StackItemProps<A>) => React.ReactNode

export function HomeStackView<A extends HomeStateItem>(props: {
  children: GetChildren<A>
}) {
  // const currentStateStore = useStore(HomeStateStore)
  const om = useOvermind()
  om.state.home.stateIds
  const breadcrumbs = getBreadcrumbs(omStatic.state.home.states)
  const key = JSON.stringify(breadcrumbs.map((x) => x.id))
  const homeStates = useMemo(() => breadcrumbs, [key])
  const currentStates = useDebounceValue(homeStates, 80) ?? homeStates
  const isRemoving = currentStates.length > homeStates.length
  const isAdding = currentStates.length < homeStates.length
  const items = isRemoving ? currentStates : homeStates

  return (
    <>
      {items.map((item, i) => {
        const isActive = i === items.length - 1
        return (
          // <PopoverShowContext.Provider
          //   key={item.id}
          //   value={isActive == true ? null : false}
          // >
          <HomeStackViewItem
            key={item.type === 'home' ? '0' : item.id}
            item={item}
            index={i}
            isActive={isActive}
            isRemoving={isRemoving && isActive}
            isAdding={isAdding && isActive}
            getChildren={props.children as any}
          />
          // </PopoverShowContext.Provider>
        )
      })}
    </>
  )
}

const HomeStackViewItem = memo(
  ({
    item,
    index,
    isActive,
    isRemoving,
    isAdding,
    getChildren,
  }: {
    getChildren: GetChildren<HomeStateItem>
    item: HomeStateItemSimple
    index: number
    isActive: boolean
    isRemoving: boolean
    isAdding: boolean
  }) => {
    // const popoverStore = useStore(PopoverStore, { id })
    const isSmall = useMediaQueryIsSmall()

    const top = isSmall
      ? searchBarHeight + 5 + Math.max(0, index - 1) * 5
      : index * 5 //index == 0 ? 0 : isSmall ? 5 : index * 5

    const left = 0

    // useEffect(() => {
    //   popoverStore.show = isActive
    // }, [isActive])

    let children = useMemo(() => {
      return getChildren({
        item: item as any,
        index,
        isActive,
      })
    }, [index, item, isActive])

    children = useLastValueWhen(() => children, isRemoving)

    const className = `animate-up ${
      !isRemoving && !isAdding ? 'active' : 'untouchable'
    }`

    return (
      // <PopoverContext.Provider value={useMemo(() => ({ id }), [id])}>
      <AbsoluteVStack
        zIndex={index}
        className={className}
        fullscreen
        pointerEvents="none"
      >
        <AbsoluteVStack
          flex={1}
          top={top}
          left={left}
          bottom={-(index * 5)}
          width="100%"
          pointerEvents={isActive ? 'auto' : 'none'}
        >
          <ErrorBoundary name={`HomeStackView.${item.type}`}>
            <Suspense fallback={null}>{children}</Suspense>
          </ErrorBoundary>
        </AbsoluteVStack>
      </AbsoluteVStack>
      // </PopoverContext.Provider>
    )
  }
)
