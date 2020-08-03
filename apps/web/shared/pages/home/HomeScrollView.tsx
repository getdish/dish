import { VStack } from '@dish/ui'
import React, { forwardRef, useRef } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'

import { drawerWidthMax, searchBarHeight } from '../../constants'
import { useOvermind } from '../../state/om'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const HomeScrollView = forwardRef(
  (
    {
      children,
      paddingTop,
      onScrollNearBottom,
      ...props
    }: ScrollViewProps & {
      children: any
      paddingTop?: any
      onScrollNearBottom?: Function
    },
    ref
  ) => {
    const om = useOvermind()
    const isSmall = useMediaQueryIsSmall()
    const tm = useRef<any>(0)
    const setIsScrolling = (e) => {
      if (
        e.nativeEvent.contentOffset.y >
        e.nativeEvent.contentSize.height * 0.4
      ) {
        onScrollNearBottom?.()
      }

      if (!om.state.home.isScrolling) {
        om.actions.home.setIsScrolling(true)
      }
      clearTimeout(tm.current)
      tm.current = setTimeout(() => {
        om.actions.home.setIsScrolling(false)
      }, 320)
    }
    return (
      <ScrollView
        ref={ref as any}
        onScroll={setIsScrolling}
        scrollEventThrottle={150}
        {...props}
        style={[
          {
            flex: 1,
            paddingTop: paddingTop ?? (isSmall ? 0 : searchBarHeight),
            // for drawer
            paddingBottom: isSmall ? 500 : 0,
          },
          props.style,
        ]}
      >
        <VStack
          // @ts-ignore
          display="inherit"
          pointerEvents={om.state.home.isScrolling ? 'none' : 'auto'}
          maxWidth={drawerWidthMax}
          alignSelf="flex-end"
          width="100%"
        >
          {children}
        </VStack>
      </ScrollView>
    )
  }
)

export const HomeScrollViewHorizontal = (
  props: ScrollViewProps & { children: any }
) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} {...props} />
  )
}
