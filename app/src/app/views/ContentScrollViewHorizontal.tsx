import { useAppDrawerWidth } from '../hooks/useAppDrawerWidth'
import { YStack, useDebounce } from '@dish/ui'
import React, { useMemo, useRef, useState } from 'react'
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native'

export const useContentScrollHorizontalFitter = () => {
  const drawerWidth = useAppDrawerWidth()
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
  const isTouching = useRef(false)

  const children = useMemo(() => {
    return (
      <ScrollView
        horizontal
        removeClippedSubviews
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={60}
        style={sheet.scrollStyle}
        {...props}
      />
    )
  }, [isTouching.current, props])

  return (
    // needs both pointer events to prevent/enable scroll on safari
    <YStack
      overflow="hidden"
      width="100%"
      // @ts-ignore
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
          <AbsoluteYStack fullscreen backgroundColor="rgba(255,255,0,0.1)" />
        )} */}
      {children}
    </YStack>
  )
}

const sheet = StyleSheet.create({
  scrollStyle: {
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 0,
  },
})
