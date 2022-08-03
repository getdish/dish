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

export function HomeStackView<A extends HomeStateItem>({
  children,
  limitVisibleStates = Infinity,
}: {
  children: GetChildren<A>
  limitVisibleStates?: number
}) {
  const { breadcrumbs } = useHomeStore()
  const key = JSON.stringify(breadcrumbs.map((x) => x.id))
  const homeStates = useMemo(() => breadcrumbs, [key])
  const currentStates = useDebounceValue(homeStates, STACK_ANIMATION_DURATION) ?? homeStates
  const isRemoving = currentStates.length > homeStates.length
  const isAdding = currentStates.length < homeStates.length
  const items = isRemoving ? currentStates : homeStates

  // prettier-ignore
  // console.log('HomeStackView', breadcrumbs, JSON.stringify({ isAdding, isRemoving }), items.map((x) => x.type))

  // when autocomplete active, show home and filter that:
  // nice because home should always display your current map position too as a special case

  const activeIndex = Math.min(limitVisibleStates, items.length - 1)
  console.log('activeIndex', activeIndex)
  // .slice(0, limitVisibleStates ?? Infinity)

  return (
    <>
      {items.map((item, i) => {
        const isActive = i === activeIndex
        return (
          <AppStackViewItem
            key={`${item.id}`}
            item={item}
            index={i}
            isActive={isActive}
            isRemoving={isRemoving && isActive}
            isAdding={isAdding && isActive}
            getChildren={children as any}
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
    const top = Math.max(0, index - 1) * 3 + 6
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
        // position="absolute"
        zIndex={index}
        className={`${index === 0 ? '' : 'animate-up'} ${
          isFullyActive ? 'active' : 'untouchable'
        }`}
        display={isFullyInactive ? 'none' : 'flex'}
        marginTop={top}
        right={0}
        bottom={-(index * 5)}
        left={0}
        pointerEvents={isActive ? 'auto' : 'none'}
        pos="absolute"
        {...(isActive && {
          pos: 'relative',
        })}
        $mdWeb={{
          opacity: isActive ? 1 : 0,
        }}
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
