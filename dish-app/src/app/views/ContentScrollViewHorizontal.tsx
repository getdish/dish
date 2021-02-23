import { assertPresent, supportsTouchWeb } from '@dish/helpers'
import { getStore, useStoreSelector } from '@dish/use-store'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native'
import { VStack, useDebounce } from 'snackui'

import { isWeb } from '../../constants/constants'
import { useAppDrawerWidthInner } from '../hooks/useAppDrawerWidth'
import { ContentScrollContext, ScrollStore } from './ContentScrollView'

export let isScrollingSubDrawer = false

function setScrollLockHorizontal(id: string) {
  const store = getStore(ScrollStore, { id })
  if (store.lock === 'vertical') {
    return
  }
  const val = isScrollingSubDrawer ? 'horizontal' : 'none'
  if (val !== store.lock) {
    store.setLock(val)
  }
}

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

export const ContentScrollViewHorizontalFitted = (
  props: ContentScrollViewHorizontalProps & {
    width: number
    setWidth: Function
  }
) => {
  return (
    <VStack
      onLayout={(x) => {
        props.setWidth(x.nativeEvent.layout.width)
      }}
      width="100%"
      position="relative"
      zIndex={100}
    >
      <ContentScrollViewHorizontal
        {...props}
        style={[
          {
            width: '100%',
            maxWidth: isWeb ? '100vw' : '100%',
          },
          props.contentContainerStyle,
        ]}
        contentContainerStyle={[
          {
            minWidth: props.width,
          },
          props.contentContainerStyle,
        ]}
      />
    </VStack>
  )
}

// takes children but we memo so we can optimize if wanted
export const ContentScrollViewHorizontal = (
  props: ContentScrollViewHorizontalProps
) => {
  const id = useContext(ContentScrollContext)
  const scrollTm = useRef<any>(0)
  const scrollVersion = useRef({
    end: 0,
    start: 0,
  })
  const $scroller = useRef<ScrollView>()
  const isLockedVertical = useStoreSelector(
    ScrollStore,
    (x) => x.lock === 'vertical',
    { id }
  )

  if (supportsTouchWeb) {
    useEffect(() => {
      const node = $scroller.current?.getInnerViewNode() as HTMLDivElement
      assertPresent(node, 'no scroll node')
      const unlockScroll = () => {
        scrollVersion.current.end++
        isScrollingSubDrawer = false
        update()
      }
      node.addEventListener('touchend', unlockScroll)
      return () => {
        node.removeEventListener('touchend', unlockScroll)
      }
    }, [])
  }

  const update = () => {
    setScrollLockHorizontal(id)
  }

  const children = useMemo(() => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={$scroller as any}
        scrollEventThrottle={40}
        style={sheet.scrollStyle}
        {...props}
        onScroll={(e) => {
          props.onScroll?.(e)
          const shouldUpdate =
            !supportsTouchWeb ||
            scrollVersion.current.start === scrollVersion.current.end
          if (shouldUpdate) {
            isScrollingSubDrawer = true
            update()
          }
          clearTimeout(scrollTm.current)
          scrollTm.current = setTimeout(() => {
            if (supportsTouchWeb) {
              if (scrollVersion.current.end > scrollVersion.current.start) {
                scrollVersion.current.start = scrollVersion.current.end
              } else {
                return
              }
            }
            isScrollingSubDrawer = false
            update()
          }, 200)
        }}
        onScrollBeginDrag={() => {
          clearTimeout(scrollTm.current)
          isScrollingSubDrawer = true
          update()
        }}
        onScrollEndDrag={() => {
          clearTimeout(scrollTm.current)
          isScrollingSubDrawer = false
          update()
        }}
      />
    )
  }, [props])

  return (
    // needs both pointer events to prevent/enable scroll on safari
    <VStack
      pointerEvents={isLockedVertical ? 'none' : 'auto'}
      overflow="hidden"
      width="100%"
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
    maxWidth: '100%',
    overflow: 'hidden',
  },
})
