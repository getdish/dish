import { useStore } from '@dish/use-store'
import React, { Suspense, memo, useLayoutEffect, useMemo } from 'react'
import { AnimatedVStack, VStack, useDebounceValue, useMedia } from 'snackui'

import { searchBarHeight, searchBarTopOffset } from './constants'
import { isWeb } from './constants'
import { getBreadcrumbs } from './helpers/getBreadcrumbs'
import { useLastValueWhen } from './hooks/useLastValueWhen'
import { HomeStateItem, HomeStateItemSimple } from './state/home-types'
import { useOvermind } from './state/useOvermind'
import { ContentParentStore } from './views/ContentScrollView'
import { ErrorBoundary } from './views/ErrorBoundary'

export type StackItemProps<A> = {
  item: A
  index: number
  isActive: boolean
}

type GetChildren<A> = (props: StackItemProps<A>) => React.ReactNode

export function AppStackView<A extends HomeStateItem>(props: {
  children: GetChildren<A>
}) {
  const om = useOvermind()
  const breadcrumbs = getBreadcrumbs(om.state.home.states)
  const key = JSON.stringify(breadcrumbs.map((x) => x.id))
  const homeStates = useMemo(() => breadcrumbs, [key])
  const currentStates = useDebounceValue(homeStates, 20) ?? homeStates
  const isRemoving = currentStates.length > homeStates.length
  const isAdding = currentStates.length < homeStates.length
  const items = isRemoving ? currentStates : homeStates

  return (
    <>
      {items.map((item, i) => {
        const isActive = i === items.length - 1
        return (
          <AppStackViewItem
            key={item.type === 'home' ? '0' : item.id}
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
    item: HomeStateItemSimple
    index: number
    isActive: boolean
    isRemoving: boolean
    isAdding: boolean
  }) => {
    const contentParentStore = useStore(ContentParentStore)
    const media = useMedia()
    const top = media.sm
      ? Math.max(0, index - 1) * 5 + (index > 0 ? 5 : 0)
      : index * 5 + (index > 0 ? searchBarHeight + searchBarTopOffset : 0)
    const left = 0

    let children = useMemo(() => {
      return getChildren({
        item: item as any,
        index,
        isActive,
      })
    }, [index, item, isActive])

    children = useLastValueWhen(() => children, isRemoving)

    useLayoutEffect(() => {
      if (isActive) {
        contentParentStore.setActiveId(item.type)
      }
    }, [isActive])

    const contents = (
      <VStack
        position="absolute"
        zIndex={index}
        className={`animate-up ${
          !isRemoving && !isAdding ? 'active' : 'untouchable'
        }`}
        top={0}
        right={0}
        bottom={0}
        left={0}
        pointerEvents="none"
      >
        <VStack
          position="absolute"
          flex={1}
          top={top}
          left={left}
          bottom={-(index * 5)}
          width="100%"
          pointerEvents={isActive ? 'auto' : 'none'}
        >
          <ErrorBoundary name={`AppStackView.${item.type}`}>
            <Suspense fallback={null}>{children}</Suspense>
          </ErrorBoundary>
        </VStack>
      </VStack>
    )

    if (!isWeb) {
      return (
        <AnimatedVStack position="absolute" fullscreen>
          {contents}
        </AnimatedVStack>
      )
    }

    return contents
  }
)
