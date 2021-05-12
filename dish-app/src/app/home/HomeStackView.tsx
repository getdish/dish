import { useStore } from '@dish/use-store'
import React, { Suspense, memo, useEffect, useMemo } from 'react'
import { AnimatedVStack, VStack, useDebounceValue, useMedia } from 'snackui'

import { isWeb, searchBarHeight, searchBarTopOffset } from '../../constants/constants'
import { HomeStateItem } from '../../types/homeTypes'
import { useHomeStore } from '../homeStore'
import { useLastValueWhen } from '../hooks/useLastValueWhen'
import { ContentParentStore } from '../views/ContentScrollView'
import { ErrorBoundary } from '../views/ErrorBoundary'

export type StackItemProps<A> = {
  item: A
  index: number
  isActive: boolean
}

type GetChildren<A> = (props: StackItemProps<A>) => React.ReactNode

export const STACK_ANIMATION_DURATION = 160

export function HomeStackView<A extends HomeStateItem>(props: { children: GetChildren<A> }) {
  const { breadcrumbs } = useHomeStore()
  const key = JSON.stringify(breadcrumbs.map((x) => x.id))
  const homeStates = useMemo(() => breadcrumbs, [key])
  const currentStates = useDebounceValue(homeStates, STACK_ANIMATION_DURATION) ?? homeStates
  const isRemoving = currentStates.length > homeStates.length
  const isAdding = currentStates.length < homeStates.length
  const items = isRemoving ? currentStates : homeStates

  // console.log(
  //   '👀 HomeStackView',
  //   JSON.stringify({ isAdding, isRemoving }),
  //   items.map((x) => x.type)
  // )

  return (
    <>
      {items.map((item, i) => {
        const isActive = i === items.length - 1
        return (
          <AppStackViewItem
            key={`${item.type}${i}`}
            item={item}
            index={i}
            isActive={isActive}
            isRemoving={isRemoving && isActive}
            isAdding={isAdding && isActive}
            getChildren={props.children as any}
          />
        )
      })}
    </>
  )
}

const AppStackViewItem = memo(
  ({
    item,
    index,
    isActive,
    isRemoving,
    isAdding,
    getChildren,
  }: {
    getChildren: GetChildren<HomeStateItem>
    item: HomeStateItem
    index: number
    isActive: boolean
    isRemoving: boolean
    isAdding: boolean
  }) => {
    const contentParentStore = useStore(ContentParentStore)
    const media = useMedia()
    const top = media.sm
      ? Math.max(0, index - 1) * 3 + 6
      : index * 5 + (index > 0 ? searchBarHeight + searchBarTopOffset : 0)
    const isFullyActive = !isRemoving && !isAdding

    let childProps = useMemo(
      () => ({
        index,
        item,
        isActive,
      }),
      [index, item, isActive]
    )

    childProps = useLastValueWhen(() => childProps, isRemoving)

    const children = useMemo(() => getChildren(childProps), [childProps])

    useEffect(() => {
      if (isActive) {
        contentParentStore.setActiveId(item.type)
      }
    }, [isActive])

    const contents = (
      <VStack
        position="absolute"
        zIndex={index}
        className={`animate-up ${isFullyActive ? 'active' : 'untouchable'}`}
        top={top}
        right={0}
        bottom={-(index * 5)}
        left={0}
        pointerEvents={isActive ? 'auto' : 'none'}
      >
        <ErrorBoundary name={`AppStackView.${item.type}`}>
          <Suspense fallback={null}>{children}</Suspense>
        </ErrorBoundary>
      </VStack>
    )

    if (!isWeb) {
      return (
        <AnimatedVStack position="absolute" fullscreen animateState={!isRemoving ? 'in' : 'out'}>
          {contents}
        </AnimatedVStack>
      )
    }

    return contents
  }
)
