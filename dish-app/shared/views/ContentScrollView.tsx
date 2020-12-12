import { Store, useStore, useStoreSelector } from '@dish/use-store'
import React, { createContext, forwardRef, useRef } from 'react'
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native'
import { VStack } from 'snackui'

import { isWeb } from '../constants'
import { useIsNarrow, useIsReallyNarrow } from '../hooks/useIs'
import { supportsTouchWeb } from '../platforms'
import { useOvermind } from '../state/useOvermind'

export class ScrollStore extends Store<{ id: string }> {
  isScrolling = false

  setIsScrolling(val: boolean) {
    this.isScrolling = val
  }
}

export class ContentParentStore extends Store {
  activeId = ''

  setActiveId(id: string) {
    this.activeId = id
  }
}

export let isScrollAtTop = true

export function setIsScrollAtTop(val: boolean) {
  isScrollAtTop = val
}

export const usePreventContentScroll = (id: string) => {
  const isActive = useStoreSelector(
    ContentParentStore,
    (store) => store.activeId === id
  )
  const isReallySmall = useIsReallyNarrow()
  const om = useOvermind()
  if (!isActive) {
    return true
  }
  return (
    (!isWeb || supportsTouchWeb) &&
    isReallySmall &&
    om.state.home.drawerSnapPoint >= 1
  )
}

export const ContentScrollContext = createContext('id')

type ContentScrollViewProps = ScrollViewProps & {
  id: string
  children: any
  onScrollYThrottled?: Function
}

export const ContentScrollView = forwardRef<ScrollView, ContentScrollViewProps>(
  ({ children, onScrollYThrottled, style, id, ...props }, ref) => {
    const preventScrolling = usePreventContentScroll(id)
    const scrollStore = useStore(ScrollStore, { id })
    const isSmall = useIsNarrow()
    const lastUpdate = useRef<any>(0)
    const finish = useRef<any>(0)
    const om = useOvermind()

    const doUpdate = (y: number, e: any) => {
      clearTimeout(finish.current)
      lastUpdate.current = Date.now()
      const isAtTop = y <= 0
      setIsScrollAtTop(isAtTop)
      onScrollYThrottled?.(y)

      // calls the recyclerview scroll, we may want to not throttle this...
      if (props.onScroll) {
        props.onScroll(e)
      }

      if (isAtTop) {
        scrollStore.setIsScrolling(false)
      } else {
        if (!scrollStore.isScrolling) {
          scrollStore.setIsScrolling(true)
        }
        finish.current = setTimeout(() => {
          scrollStore.setIsScrolling(false)
        }, 220)
      }
    }

    const setIsScrolling = (e) => {
      const y = e.nativeEvent.contentOffset.y
      const nextScrollAtTop = y <= 0
      const hasBeenAWhile = Date.now() - lastUpdate.current > 200
      if (nextScrollAtTop !== isScrollAtTop || hasBeenAWhile) {
        doUpdate(y, e)
      }
    }

    return (
      <ContentScrollContext.Provider value={id}>
        <ScrollView
          ref={ref}
          {...props}
          onScroll={setIsScrolling}
          scrollEventThrottle={16}
          scrollEnabled={!preventScrolling}
          disableScrollViewPanResponder={preventScrolling}
          style={[styles.scroll, style]}
        >
          {children}

          {/* for drawer, pad bottom */}
          <VStack
            height={isSmall && om.state.home.drawerSnapPoint > 0 ? 300 : 0}
          />
        </ScrollView>
      </ContentScrollContext.Provider>
    )
  }
)

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    height: '100%',
    maxHeight: '100%',
  },
})
