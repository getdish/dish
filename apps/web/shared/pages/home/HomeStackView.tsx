import { AbsoluteVStack, VStack, useDebounceValue } from '@dish/ui'
import React, { Suspense, memo, useMemo } from 'react'

import { HomeStateItem, HomeStateItemSimple } from '../../state/home'
import { omStatic, useOvermind } from '../../state/useOvermind'
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
  // const currentStateStore = useRecoilStore(HomeStateStore)
  const om = useOvermind()
  om.state.home.stateIds
  const stackItems = getBreadcrumbs(omStatic.state.home.states)
  const key = JSON.stringify(stackItems.map((x) => x.id))
  const homeStates = useMemo(() => stackItems, [key])
  const currentStates = useDebounceValue(homeStates, 80) ?? homeStates
  const isRemoving = currentStates.length > homeStates.length
  const isAdding = currentStates.length < homeStates.length
  const items = isRemoving ? currentStates : homeStates

  // if (true) {
  //   console.log(
  //     'HomeStackView',
  //     cloneDeep({ isRemoving, states, homeStates, items })
  //   )
  // }

  return (
    <AbsoluteVStack fullscreen>
      <StackItemsAdjustableFrame>
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
              isAdding={isAdding && isActive}
              getChildren={props.children as any}
            />
            // </PopoverShowContext.Provider>
          )
        })}
      </StackItemsAdjustableFrame>
    </AbsoluteVStack>
  )
}

const StackItemsAdjustableFrame = (props: { children: any }) => {
  const om = useOvermind()

  return <AbsoluteVStack fullscreen>{props.children}</AbsoluteVStack>
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
    // const popoverStore = useRecoilStore(PopoverStore, { id })
    const isSmall = useMediaQueryIsSmall()

    const top = index == 0 ? 0 : isSmall ? 5 : index * 5
    // const left = isSmall ? 0 : Math.max(0, index) * 3

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

    const className = `animate-up ${!isRemoving && !isAdding ? 'active' : ''}`

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
            left={!isSmall && index > 0 ? 12 : 0}
            bottom={-(index * 5)}
            width="100%"
            pointerEvents="auto"
          >
            <ErrorBoundary name={`HomeStackView.${item.type}`}>
              <Suspense fallback={null}>{children}</Suspense>
            </ErrorBoundary>
          </AbsoluteVStack>
        </AbsoluteVStack>
      </VStack>
      // </PopoverContext.Provider>
    )
  }
)
