import { VStack } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { forwardRef, useMemo, useRef } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'

import { drawerWidthMax, searchBarHeight } from '../../constants'
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
    const scrollStore = useStore(ScrollStore)
    const isSmall = useMediaQueryIsSmall()
    const tm = useRef<any>(0)
    const setIsScrolling = (e) => {
      onScrollYThrottled?.(e.nativeEvent.contentOffset.y)
      scrollStore.setIsScrolling(true)
      clearTimeout(tm.current)
      tm.current = setTimeout(() => {
        scrollStore.setIsScrolling(false)
      }, 200)
    }

    return (
      <ScrollView
        ref={ref as any}
        onScroll={setIsScrolling}
        bounces
        scrollEventThrottle={200}
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
          pointerEvents={scrollStore.isScrolling ? 'none' : 'auto'}
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
