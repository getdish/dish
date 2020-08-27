import { VStack } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { forwardRef, useMemo, useRef } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'

import { drawerWidthMax, searchBarHeight } from '../../constants'
import { useOvermind } from '../../state/om'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

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
      onScrollNearBottom,
      style,
      ...props
    }: ScrollViewProps & {
      children: any
      paddingTop?: any
      onScrollNearBottom?: Function
    },
    ref
  ) => {
    const scrollStore = useStore(ScrollStore)
    const isSmall = useMediaQueryIsSmall()
    const tm = useRef<any>(0)
    const setIsScrolling = (e) => {
      if (
        e.nativeEvent.contentOffset.y >
        e.nativeEvent.contentSize.height * 0.4
      ) {
        onScrollNearBottom?.()
      }
      scrollStore.setIsScrolling(true)
      clearTimeout(tm.current)
      tm.current = setTimeout(() => {
        scrollStore.setIsScrolling(false)
      }, 200)
    }

    return (
      <VStack className="scroll-bounce" flex={1} overflow="hidden">
        <ScrollView
          ref={ref as any}
          onScroll={setIsScrolling}
          bounces
          scrollEventThrottle={150}
          {...props}
          style={[
            {
              flex: 1,
              paddingTop: paddingTop ?? (isSmall ? 0 : searchBarHeight),
              // for drawer
              paddingBottom: isSmall ? 500 : 0,
            },
            style,
          ]}
        >
          <VStack
            pointerEvents={scrollStore.isScrolling ? 'none' : 'auto'}
            maxWidth={isSmall ? '100%' : drawerWidthMax}
            alignSelf="flex-end"
            width="100%"
          >
            {children}
          </VStack>
        </ScrollView>
      </VStack>
    )
  }
)

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
        // @ts-ignore 'auto' fixes ios not letting drag
        style={{ pointerEvents: isScrolling ? 'none' : 'auto' }}
        {...rest}
      >
        {childrenElements}
      </ScrollView>
    </VStack>
  )
}
