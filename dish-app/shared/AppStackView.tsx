import {
  AbsoluteVStack,
  AnimatedVStack,
  VStack,
  useDebounceValue,
} from '@dish/ui'
import React, { Suspense, memo, useMemo } from 'react'

import { isWeb, searchBarHeight } from './constants'
import { getBreadcrumbs } from './helpers/getBreadcrumbs'
import { useIsNarrow } from './hooks/useIs'
import { useLastValueWhen } from './hooks/useLastValueWhen'
import { HomeStateItem, HomeStateItemSimple } from './state/home-types'
import { useOvermind } from './state/om'
import { omStatic } from './state/omStatic'
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
    const isSmall = useIsNarrow()
    const top = isSmall
      ? Math.max(0, index - 1) * 5 + 2
      : index * 5 + (index > 0 ? searchBarHeight : 0)
    const left = 0

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

    const contents = (
      <VStack
        position="absolute"
        zIndex={index}
        className={className}
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
          contain="layout"
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
