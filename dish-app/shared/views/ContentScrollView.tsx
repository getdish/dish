import { VStack, combineRefs } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { createContext, forwardRef, useEffect, useRef } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'

import {
  drawerWidthMax,
  isWeb,
  searchBarHeight,
  supportsTouchWeb,
} from '../constants'
import { useIsNarrow, useIsReallyNarrow } from '../hooks/useIs'
import { useOvermind } from '../state/om'

export class ScrollStore extends Store<{ id: string }> {
  isScrolling = false

  setIsScrolling(val: boolean) {
    this.isScrolling = val
  }
}

export let isScrollAtTop = true

export function setIsScrollAtTop(val: boolean) {
  isScrollAtTop = val
}

export const usePreventContentScroll = () => {
  const isReallySmall = useIsReallyNarrow()
  const om = useOvermind()
  return (
    (!isWeb || supportsTouchWeb) &&
    isReallySmall &&
    om.state.home.drawerSnapPoint >= 1
  )
}

export const ContentScrollContext = createContext('id')

export const ContentScrollView = forwardRef(
  (
    {
      children,
      paddingTop,
      onScrollYThrottled,
      style,
      id,
      ...props
    }: ScrollViewProps & {
      id: string
      children: any
      paddingTop?: any
      onScrollYThrottled?: Function
    },
    ref
  ) => {
    const preventScrolling = usePreventContentScroll()
    const scrollStore = useStore(ScrollStore, { id })
    const isSmall = useIsNarrow()
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
      }, 200)
    }

    return (
      <ContentScrollContext.Provider value={id}>
        <ScrollView
          ref={ref as any}
          onScroll={setIsScrolling}
          scrollEventThrottle={150}
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
            maxWidth={isSmall ? '100%' : drawerWidthMax}
            alignSelf="flex-end"
            overflow="hidden"
            width="100%"
            flex={1}
          >
            {children}

            {/* for drawer, pad bottom */}
            <VStack height={isSmall ? 300 : 0} />
          </VStack>
        </ScrollView>
      </ContentScrollContext.Provider>
    )
  }
)
