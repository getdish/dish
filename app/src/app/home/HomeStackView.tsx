import { searchBarHeight, searchBarTopOffset } from '../../constants/constants'
import { HomeStateItem } from '../../types/homeTypes'
import { autocompleteSearchStore, autocompletesStore } from '../AutocompletesStore'
import { useHomeStore } from '../homeStore'
import { useLastValueWhen } from '../hooks/useLastValueWhen'
import { ContentParentStore } from '../views/ContentScrollView'
import { ErrorBoundary } from '../views/ErrorBoundary'
import { isSafari } from '@dish/helpers'
import { YStack, useDebounceValue, useIsTouchDevice, useMedia } from '@dish/ui'
import { useStore, useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo, useEffect, useMemo } from 'react'

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

  // when autocomplete active, show home and filter that:
  // nice because home should always display your current map position too as a special case
  const { visible } = useStoreInstance(autocompletesStore)
  console.log('autocomplete', visible)

  // prettier-ignore
  // console.log('HomeStackView', breadcrumbs, JSON.stringify({ isAdding, isRemoving }), items.map((x) => x.type))

  return (
    <>
      {items.map((item, i) => {
        const isActive = i === items.length - 1
        return (
          <AppStackViewItem
            key={`${item.id}`}
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

    // safari ios drag optimization: when fully inactive hide it
    const isTouchDevice = useIsTouchDevice()
    const isInactive = isSafari && isTouchDevice && !isRemoving && !isActive && !isActive
    const isInactiveDelayed = useDebounceValue(isInactive, 300)
    const isFullyInactive = isInactive && isInactiveDelayed

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
      <YStack
        position="absolute"
        zIndex={index}
        className={`animate-up ${isFullyActive ? 'active' : 'untouchable'}`}
        display={isFullyInactive ? 'none' : 'flex'}
        top={top}
        right={0}
        bottom={-(index * 5)}
        left={0}
        pointerEvents={isActive ? 'auto' : 'none'}
      >
        <ErrorBoundary name={`AppStackView.${item.type}`}>
          <Suspense fallback={null}>{children}</Suspense>
        </ErrorBoundary>
      </YStack>
    )

    // if (!isWeb) {
    //   return (
    //     <AnimatedYStack position="absolute" fullscreen animateState={!isRemoving ? 'in' : 'out'}>
    //       {contents}
    //     </AnimatedYStack>
    //   )
    // }

    return contents
  }
)
