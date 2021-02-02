import { supportsTouchWeb } from '@dish/helpers/src'
import { assertPresent } from '@dish/helpers/src'
import { assert } from '@dish/helpers/src'
import { getStore, useStoreSelector } from '@dish/use-store'
import React, { memo, useContext, useEffect, useMemo, useRef } from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'
import { VStack } from 'snackui'

import { ContentScrollContext, ScrollStore } from './ContentScrollView'

export let isScrollingSubDrawer = false

function setScrollLockHorizontal(id: string) {
  const store = getStore(ScrollStore, { id })
  assert(store.lock !== 'vertical', 'not locked vertically')
  const val = isScrollingSubDrawer ? 'horizontal' : 'none'
  if (val !== store.lock) {
    store.setLock(val)
  }
}

// takes children but we memo so we can optimize if wanted
export const ContentScrollViewHorizontal = memo(
  (props: ScrollViewProps & { children: any }) => {
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
      >
        {/* DEBUG VIEW */}
        {/* {isScrolling && (
          <AbsoluteVStack fullscreen backgroundColor="rgba(255,255,0,0.1)" />
        )} */}
        {children}
      </VStack>
    )
  }
)
