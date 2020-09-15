import { VStack } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { forwardRef, useMemo, useRef } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'

import { drawerWidthMax, searchBarHeight } from '../../constants'
import { useOvermind } from '../../state/om'
import { useIsNarrow, useIsReallyNarrow } from './useIs'

class ScrollStore extends Store {
  isScrolling = false

  setIsScrolling(val: boolean) {
    this.isScrolling = val
  }
}

export const HomeScrollView = forwardRef(
  (
    {
      children,
      paddingTop,
      onScrollYThrottled,
      style,
      ...props
    }: ScrollViewProps & {
      children: any
      paddingTop?: any
      onScrollYThrottled?: Function
    },
    ref
  ) => {
    const om = useOvermind()
    const scrollStore = useStore(ScrollStore)
    const isSmall = useIsNarrow()
    const isReallySmall = useIsReallyNarrow()
    const tm = useRef<any>(0)
    const setIsScrolling = (e) => {
      onScrollYThrottled?.(e.nativeEvent.contentOffset.y)
      scrollStore.setIsScrolling(true)
      clearTimeout(tm.current)
      tm.current = setTimeout(() => {
        scrollStore.setIsScrolling(false)
      }, 200)
    }

    const preventTouching = scrollStore.isScrolling
    const preventScrolling = isReallySmall && om.state.home.drawerSnapPoint >= 1

    return (
      <ScrollView
        ref={ref as any}
        onScroll={setIsScrolling}
        bounces
        scrollEventThrottle={200}
        scrollEnabled={!preventScrolling}
        {...props}
        style={[
          {
            flex: 1,
            paddingTop: paddingTop ?? (isSmall ? 0 : searchBarHeight),
            height: '100%',
          },
          style,
        ]}
      >
        <VStack
          pointerEvents={preventTouching ? 'none' : 'auto'}
          maxWidth={isSmall ? '100%' : drawerWidthMax}
          alignSelf="flex-end"
          overflow="hidden"
          width="100%"
          flex={1}
        >
          {children}

          {/* for drawer, pad bottom */}
          <VStack height={isSmall ? 500 : 0} />
        </VStack>
      </ScrollView>
    )
  }
)

export let isScrollingSubDrawer = false

export const HomeScrollViewHorizontal = ({
  children,
  ...rest
}: ScrollViewProps & { children: any }) => {
  const { isScrolling } = useStore(ScrollStore)
  const childrenElements = useMemo(() => children, [children])
  return (
    // needs both pointer events to prevent/enable scroll on safari
    <VStack
      pointerEvents={isScrolling ? 'none' : 'auto'}
      overflow="hidden"
      width="100%"
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={() => {
          isScrollingSubDrawer = true
        }}
        onScrollEndDrag={() => {
          isScrollingSubDrawer = false
        }}
        // @ts-ignore 'auto' fixes ios not letting drag
        style={{ pointerEvents: isScrolling ? 'none' : 'auto' }}
        {...rest}
      >
        {childrenElements}
      </ScrollView>
    </VStack>
  )
}
