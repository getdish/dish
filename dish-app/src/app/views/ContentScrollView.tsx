import { Store, getStore, reaction } from '@dish/use-store'
import React, {
  Suspense,
  createContext,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native'
import { VStack, combineRefs, getMedia, useMedia } from 'snackui'

import { isWeb } from '../../constants/constants'
import { isTouchDevice, supportsTouchWeb } from '../../constants/platforms'
import { drawerStore } from '../drawerStore'

export type ScrollLock = 'horizontal' | 'vertical' | 'drawer' | 'none'

export const scrollViews = new Map<string, ScrollView>()
export const scrollLastY = new Map<string, number>()
export const scrollCurY = new Map<string, number>()
export const isScrollAtTop = new Map<string, boolean>()

export class ScrollStore extends Store<{ id: string }> {
  lock: ScrollLock = 'none'
  isAtTop = true

  setLock(val: ScrollLock) {
    this.lock = val
    if (val === 'horizontal') {
      drawerStore.setIsDragging(false)
    }
  }

  setIsAtTop(val: boolean) {
    this.isAtTop = val
  }
}

export class ContentParentStore extends Store {
  activeId = ''

  setActiveId(id: string) {
    this.activeId = id
  }
}

export const usePreventVerticalScroll = (id: string) => {
  const [prevent, setPrevent] = useState(false)

  useEffect(() => {
    if (isWeb && !supportsTouchWeb) {
      return
    }

    let isParentActive = false
    let isMinimized = false
    let isLockedHorizontalOrDrawer = false
    let isAtTop = true
    let isDraggingDrawer = false

    const parentStore = getStore(ContentParentStore)
    const scrollStore = getStore(ScrollStore, { id })

    // TODO once reactions are finished to support doing all in one function
    // we can greatly simplify this area

    const update = () => {
      const isLarge = getMedia().lg
      const isActive =
        isParentActive &&
        !isMinimized &&
        !isDraggingDrawer &&
        !isLarge &&
        !isLockedHorizontalOrDrawer
      setPrevent(!isActive)
    }

    const d0 = reaction(
      parentStore,
      (x) => x.activeId === id,
      function parentStoreActiveIdToPreventScroll(next) {
        isParentActive = next
        update()
      }
    )

    const d1 = reaction(
      drawerStore,
      (x) => x.snapIndex === 0,
      function drawerStoreSnapIndexToPreventScroll(x) {
        console.log('set is minimzed', x, drawerStore.snapIndex)
        isMinimized = x
        update()
      }
    )

    const d2 = reaction(
      scrollStore as any,
      (x) => [x.lock, x.isAtTop] as const,
      function scrollLockToPreventScroll([lock, t]) {
        isAtTop = t
        isLockedHorizontalOrDrawer = lock === 'horizontal' || lock === 'drawer'
        update()
      }
    )

    const d3 = reaction(
      drawerStore,
      (x) => x.isDragging,
      function parentStoreActiveIdToPreventScroll(next) {
        isDraggingDrawer = next
        update()
      }
    )

    return () => {
      d0()
      d1()
      d2()
      d3()
    }
  }, [id])

  return prevent
}

export const ContentScrollContext = createContext('id')

type ContentScrollViewProps = ScrollViewProps & {
  id: string
  children: any
  onScrollYThrottled?: Function
}

let last
const cancelTouchContentIfDrawerDragging = (e) => {
  if (!drawerStore.isDragging) {
    return
  }
  e.preventDefault()
  const node = (e.currentTarget as any) as HTMLDivElement
  if (node.style.overflow !== 'hidden') {
    last = node.style.overflow
  }
  node.style.overflow = 'hidden'
  setTimeout(() => {
    node.style.overflow = last
  }, 100)
}

export const ContentScrollView = forwardRef<ScrollView, ContentScrollViewProps>(
  ({ children, onScrollYThrottled, style, id, ...props }, ref) => {
    // this updates when drawer moves to top
    // this is already handled in usePreventVerticalScroll i think
    // const isActive = useStoreSelector(ContentParentStore, x => x.activeId === id, { id })
    // const isDraggingParent = useStoreInstanceSelector(drawerStore, x => isActive && x.isDragging, [isActive])
    const preventScrolling = usePreventVerticalScroll(id)
    const media = useMedia()
    const lastUpdate = useRef<any>(0)
    const finish = useRef<any>(0)

    // note, not using it, not reacting
    const scrollStore = getStore(ScrollStore, { id })

    const doUpdate = (y: number, e: any) => {
      clearTimeout(finish.current)
      lastUpdate.current = Date.now()
      const isAtTop = y <= 0
      isScrollAtTop.set(id, isAtTop)
      onScrollYThrottled?.(y)

      // calls the recyclerview scroll, we may want to not throttle this...
      if (props.onScroll) {
        props.onScroll(e)
      }

      if (isAtTop) {
        if (!scrollStore.isAtTop) {
          scrollStore.setIsAtTop(true)
        }
        if (!isTouchDevice) {
          scrollStore.setLock('none')
        }
      } else {
        if (scrollStore.isAtTop) {
          scrollStore.setIsAtTop(false)
        }
        if (scrollStore.lock === 'none') {
          scrollStore.setLock('vertical')
        }
        finish.current = setTimeout(() => {
          scrollStore.setLock('none')
        }, 220)
      }
    }

    const setIsScrolling = (e) => {
      const y = e.nativeEvent.contentOffset.y
      scrollCurY.set(id, y)
      const atTop = y <= 0
      const hasBeenAWhile = Date.now() - lastUpdate.current > 150
      if (atTop !== isScrollAtTop.get(id) || hasBeenAWhile) {
        doUpdate(y, e)
      }
    }

    // memo because preventScrolling changes on media queries
    const childrenMemo = useMemo(() => {
      return children
    }, [children])
    const scrollRef = useRef<ScrollView | null>(null)

    useEffect(() => {
      if (scrollRef.current) {
        scrollViews.set(id, scrollRef.current)
      }
    }, [id, scrollRef.current])

    // useEffect(() => {
    //   const view =scrollRef.current
    //   scrollViews.add(view)
    //   return () => {
    //     scrollViews.delete(view)
    //   }
    // }, [])

    // const drawerStore_ = useStoreInstance(drawerStore)

    // useEffect(() => {
    //   console.log('drawerStore_.isDragging', drawerStore_.isDragging)
    // }, [drawerStore_.isDragging])

    return (
      <ContentScrollContext.Provider value={id}>
        <VStack flex={1} overflow="hidden" pointerEvents={preventScrolling ? 'none' : undefined}>
          <ScrollView
            ref={combineRefs(scrollRef, ref)}
            {...props}
            onScroll={setIsScrolling}
            onMomentumScrollEnd={({ nativeEvent }) => {
              scrollLastY.set(id, nativeEvent.contentOffset.y)
            }}
            {...(supportsTouchWeb && {
              onTouchMove: cancelTouchContentIfDrawerDragging,
              onTouchStart: cancelTouchContentIfDrawerDragging,
            })}
            {...(isTouchDevice && {
              onTouchEnd: () => {
                scrollStore.setLock('none')
              },
            })}
            // for native...
            bounces={false}
            scrollEnabled={!preventScrolling}
            // short duration to catch before vertical scroll
            scrollEventThrottle={8}
            // disableScrollViewPanResponder={preventScrolling}
            style={[styles.scroll, style]}
          >
            <Suspense fallback={null}>{childrenMemo}</Suspense>

            {/* for drawer, pad bottom */}
            <VStack height={media.sm ? 300 : 0} />
          </ScrollView>
        </VStack>
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
