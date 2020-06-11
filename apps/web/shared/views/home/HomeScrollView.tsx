import { VStack, useDebounce } from '@dish/ui'
import React, { useMemo, useRef, useState } from 'react'
import { useCallback } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'

import { searchBarHeight } from '../../constants'
import { useOvermind } from '../../state/useOvermind'
import { useMediaQueryIsSmall } from './HomeViewDrawer'

export const HomeScrollView = ({
  children,
  ...props
}: ScrollViewProps & { children: any }) => {
  const om = useOvermind()
  const isSmall = useMediaQueryIsSmall()
  const tm = useRef<any>(0)
  const setIsScrolling = () => {
    if (!om.state.home.isScrolling) {
      om.actions.home.setIsScrolling(true)
    }
    clearTimeout(tm.current)
    tm.current = setTimeout(() => {
      om.actions.home.setIsScrolling(false)
    }, 350)
  }
  return (
    <ScrollView
      onScroll={setIsScrolling}
      scrollEventThrottle={100}
      {...props}
      style={[
        { flex: 1, paddingTop: isSmall ? 0 : searchBarHeight },
        props.style,
      ]}
    >
      <VStack
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
