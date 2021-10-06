import { assertPresent, supportsTouchWeb } from '@dish/helpers'
import { getStore } from '@dish/use-store'
import { useEffect, useRef } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native'

import { isWeb } from '../../constants/constants'
import { ScrollLock, ScrollStore } from './ContentScrollView'

export const useScrollLock = ({ id, direction }: { id: string; direction: ScrollLock }) => {
  const isActivelyScrolling = useRef(false)
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
      if (!scrollRef.current?.getScrollableNode) return
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
      if (supportsTouchWeb) {
        // see hook above
        return
      }
      if (isWeb) {
        clearTimeout(scrollTm.current)
        scrollTm.current = setTimeout(() => {
          updateLock(false)
        }, 200)
      }
      if (!isWeb && isActivelyScrolling.current === false) {
        // avoid locking because onScroll calls after onScrollEndDrag
        return
      }
      if (!isLocked()) {
        updateLock(true)
      }
    },
    onScrollBeginDrag: () => {
      isActivelyScrolling.current = true
      clearTimeout(scrollTm.current)
      updateLock(true)
    },
    onScrollEndDrag: () => {
      isActivelyScrolling.current = false
      clearTimeout(scrollTm.current)
      updateLock(false)
    },
  }
}
