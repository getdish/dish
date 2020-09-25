// debug
import { VStack, combineRefs } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { forwardRef, useEffect, useRef } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'

import { drawerWidthMax, isWeb, searchBarHeight } from '../constants'
import { useIsNarrow, useIsReallyNarrow } from '../hooks/useIs'
import { useOvermind } from '../state/om'

export class ScrollStore extends Store {
  isScrolling = false

  setIsScrolling(val: boolean) {
    this.isScrolling = val
  }
}

export let isScrollAtTop = true

export const ContentScrollView = forwardRef(
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
      const y = e.nativeEvent.contentOffset.y
      isScrollAtTop = y <= 0
      onScrollYThrottled?.(y)
      // perf issue i believe
      if (!scrollStore.isScrolling) {
        scrollStore.setIsScrolling(true)
      }
      clearTimeout(tm.current)
      tm.current = setTimeout(() => {
        scrollStore.setIsScrolling(false)
      }, 150)
    }
    const scrollRef = useRef()

    const preventTouching = scrollStore.isScrolling
    const preventScrolling =
      !isWeb && isReallySmall && om.state.home.drawerSnapPoint >= 1

    return (
      <ScrollView
        ref={combineRefs(ref as any, scrollRef)}
        onScroll={setIsScrolling}
        scrollEventThrottle={100}
        scrollEnabled={!preventScrolling}
        disableScrollViewPanResponder={preventScrolling}
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
