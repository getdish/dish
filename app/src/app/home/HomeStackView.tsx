import { HomeStateItem } from '../../types/homeTypes'
import { useHomeStore } from '../homeStore'
import { useLastValueWhen } from '../hooks/useLastValueWhen'
import { ErrorBoundary } from '../views/ErrorBoundary'
import { isSafari } from '@dish/helpers'
import { YStack, useDebounceValue, useIsTouchDevice } from '@dish/ui'
import React, { Suspense, memo, useMemo } from 'react'

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
  let isRemoving = currentStates.length > homeStates.length
  const isAdding = currentStates.length < homeStates.length
  const items = isRemoving ? currentStates : homeStates

  // prettier-ignore
  // console.log('HomeStackView', breadcrumbs, JSON.stringify({ isAdding, isRemoving }), items.map((x) => x.type))

  const activeIndex = Math.min(limitVisibleStates, items.length - 1)

  return (
    <>
      {items.map((item, index) => {
        const isActive = index === activeIndex
        const isHidingChildren = !isActive && limitVisibleStates < 1_000
        if (isHidingChildren) {
          isRemoving = index > activeIndex
        }
        return (
          <AppStackViewItem
            key={`${item.id}`}
            item={item}
            index={index}
            isActive={isActive}
            isRemoving={isRemoving && isActive}
            isAdding={isAdding && isActive}
            isHidingChildren={isHidingChildren}
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
    isHidingChildren,
  }: {
    getChildren: GetChildren<HomeStateItem>
    item: HomeStateItem
    index: number
    isActive: boolean
    isRemoving: boolean
    isAdding: boolean
    isHidingChildren: boolean
  }) => {
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

    const contents = (
      <YStack
        // position="absolute"
        zIndex={index}
        className={
          isHidingChildren
            ? ''
            : `${index === 0 ? '' : 'animate-up'} ${isFullyActive ? 'active' : 'untouchable'}`
        }
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
          opacity: isActive && !isHidingChildren ? 1 : 0,
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
