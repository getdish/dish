import { assertPresent, supportsTouchWeb } from '@dish/helpers'
import { getStore } from '@dish/use-store'
import { useEffect, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native'

import { isWeb } from '../../constants/constants'
import { ScrollLock, ScrollStore } from './ContentScrollView'

export const isScrollLocked = (id: string, direction?: ScrollLock) => {
  const store = getStore(ScrollStore, { id })
  return direction ? store.lock === direction : store.lock !== 'none'
}

export const useScrollLock = ({ id, direction }: { id: string; direction: ScrollLock }) => {
  const scrollRef = useRef<ScrollView>(null)
  const scrollTm = useRef<any>(0)
  const store = getStore(ScrollStore, { id })
  const isLocked = () => store.lock === direction

  const updateLock = (val: boolean) => {
    if (store.lock === 'vertical') {
      return
    }
    const next = val ? direction : 'none'
    if (next !== store.lock) {
      store.setLock(next)
    }
  }

  if (supportsTouchWeb) {
    // touch only logic for scroll locking (faster)
    useEffect(() => {
      const node = scrollRef.current?.getScrollableNode() as HTMLDivElement
      assertPresent(node, 'no scroll node')
      let preventUntilNext = false
      const onScroll = () => {
        if (preventUntilNext) return
        updateLock(true)
      }
      const onTouchEnd = () => {
        if (isLocked()) {
          preventUntilNext = true
          updateLock(false)
        }
      }
      const onTouchStart = () => {
        preventUntilNext = false
      }
      node.addEventListener('scroll', onScroll)
      node.addEventListener('touchend', onTouchEnd)
      node.addEventListener('touchstart', onTouchStart)
      return () => {
        node.removeEventListener('touchend', onTouchEnd)
        node.removeEventListener('scroll', onScroll)
        node.removeEventListener('touchstart', onTouchStart)
      }
    }, [])
  }

  return {
    scrollRef,
    updateLock,
    onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isWeb || supportsTouchWeb) {
        // see hook above
        return
      }
      clearTimeout(scrollTm.current)
      scrollTm.current = setTimeout(() => {
        updateLock(false)
      }, 200)
      if (!isLocked()) {
        console.log('SCROLL')
        updateLock(true)
      }
    },
    onScrollBeginDrag: () => {
      clearTimeout(scrollTm.current)
      updateLock(true)
    },
    onScrollEndDrag: () => {
      clearTimeout(scrollTm.current)
      updateLock(false)
    },
  }
}
