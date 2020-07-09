import { VStack } from '@dish/ui'
import React, { useRef } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'

import { searchBarHeight } from '../../constants'
import { useOvermind } from '../../state/useOvermind'
import { useMediaQueryIsSmall } from './HomeViewDrawer'

export const HomeScrollView = ({
  children,
  paddingTop,
  onScrollNearBottom,
  ...props
}: ScrollViewProps & {
  children: any
  paddingTop?: any
  onScrollNearBottom?: Function
}) => {
  const om = useOvermind()
  const isSmall = useMediaQueryIsSmall()
  const tm = useRef<any>(0)
  const setIsScrolling = (e) => {
    if (
      e.nativeEvent.contentOffset.y >
      e.nativeEvent.contentSize.height * 0.45
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
      onScroll={setIsScrolling}
      scrollEventThrottle={200}
      {...props}
      style={[
        { flex: 1, paddingTop: paddingTop ?? (isSmall ? 0 : searchBarHeight) },
        props.style,
      ]}
    >
      <VStack
        // @ts-ignore
        display="inherit"
        pointerEvents={om.state.home.isScrolling ? 'none' : 'auto'}
      >
        {children}
      </VStack>
    </ScrollView>
  )
}

export const HomeScrollViewHorizontal = (
  props: ScrollViewProps & { children: any }
) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} {...props} />
  )
}
