import { useStoreSelector } from '@dish/use-store'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native'
import { VStack, useDebounce } from 'snackui'

import { useAppDrawerWidthInner } from '../hooks/useAppDrawerWidth'
import { ContentScrollContext, ScrollStore } from './ContentScrollView'
import { useScrollLock } from './useScrollLock'

export const useContentScrollHorizontalFitter = () => {
  const drawerWidth = useAppDrawerWidthInner()
  const minWidth = Math.min(drawerWidth, 600)
  const [width, setWidth] = useState(Math.max(minWidth, drawerWidth))
  const setWidthDebounce = useDebounce(setWidth, 250)
  return { width, setWidth, minWidth, setWidthDebounce, drawerWidth }
}

export type ContentScrollViewHorizontalProps = ScrollViewProps & {
  height?: number
  children: any
}

// takes children but we memo so we can optimize if wanted
export const ContentScrollViewHorizontal = (props: ContentScrollViewHorizontalProps) => {
  const id = useContext(ContentScrollContext)
  const isLockedVertical = useStoreSelector(ScrollStore, (x) => x.lock === 'vertical', { id })
  const scrollLock = useScrollLock({ id, direction: 'horizontal' })

  // useEffect(() => {
  //   const node = scrollLock.scrollRef.current?.getScrollableNode() as HTMLDivElement
  //   if (!node) return
  //   node.addEventListener(
  //     'touchmove',
  //     (e) => {
  //       e.stopPropagation()
  //     },
  //     { passive: false }
  //   )
  // }, [])

  const children = useMemo(() => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollLock.scrollRef}
        scrollEventThrottle={60}
        style={sheet.scrollStyle}
        {...props}
        onScroll={(e) => {
          props.onScroll?.(e)
          scrollLock.onScroll(e)
        }}
        onScrollBeginDrag={scrollLock.onScrollBeginDrag}
        onScrollEndDrag={scrollLock.onScrollEndDrag}
      />
    )
  }, [props])

  return (
    // needs both pointer events to prevent/enable scroll on safari
    <VStack
      overflow="hidden"
      width="100%"
      pointerEvents={isLockedVertical ? 'none' : 'auto'}
      height={props.height}
    >
      {/* DEBUG VIEW */}
      {/* {isScrolling && (
          <AbsoluteVStack fullscreen backgroundColor="rgba(255,255,0,0.1)" />
        )} */}
      {children}
    </VStack>
  )
}

const sheet = StyleSheet.create({
  scrollStyle: {
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
  },
})
