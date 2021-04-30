import { useStoreSelector } from '@dish/use-store'
import React, { useContext, useMemo, useState } from 'react'
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native'
import { VStack, useDebounce } from 'snackui'

import { isWeb } from '../../constants/constants'
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
            maxWidth: '100%',
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
export const ContentScrollViewHorizontal = (props: ContentScrollViewHorizontalProps) => {
  const id = useContext(ContentScrollContext)
  const isLockedVertical = useStoreSelector(ScrollStore, (x) => x.lock === 'vertical', { id })
  const scrollLock = useScrollLock({ id, direction: 'horizontal' })

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
