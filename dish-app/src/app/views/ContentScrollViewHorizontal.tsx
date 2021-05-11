import { useStoreSelector } from '@dish/use-store'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native'
import { VStack, isTouchDevice, useDebounce, useGet } from 'snackui'

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
  const isLockedOut = useStoreSelector(
    ScrollStore,
    (x) => x.lock === 'vertical' || x.lock === 'drawer',
    { id }
  )
  const getIsLockedOut = useGet(isLockedOut)
  const scrollLock = useScrollLock({ id, direction: 'horizontal' })
  const isTouching = useRef(false)

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
        scrollEnabled={!isLockedOut}
        onScroll={(e) => {
          if (isTouching.current && getIsLockedOut()) {
            return false
          }
          props.onScroll?.(e)
          scrollLock.onScroll(e)
        }}
        onScrollBeginDrag={scrollLock.onScrollBeginDrag}
        onScrollEndDrag={scrollLock.onScrollEndDrag}
      />
    )
  }, [isTouching.current, isLockedOut, props])

  return (
    // needs both pointer events to prevent/enable scroll on safari
    <VStack
      overflow="hidden"
      width="100%"
      pointerEvents={isLockedOut ? 'none' : 'auto'}
      onTouchStart={() => {
        isTouching.current = true
      }}
      onTouchEnd={() => {
        isTouching.current = false
      }}
      height={props.height}
      contain="paint"
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
