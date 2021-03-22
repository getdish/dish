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
import { supportsTouchWeb } from '../../constants/platforms'
import { drawerStore } from '../drawerStore'

type ScrollLock = 'horizontal' | 'vertical' | 'none'

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

export let isScrollAtTop = true

export function setIsScrollAtTop(val: boolean) {
  isScrollAtTop = val
}

export const usePreventVerticalScroll = (id: string) => {
  const [prevent, setPrevent] = useState(false)

  useEffect(() => {
    if (isWeb && !supportsTouchWeb) {
      return
    }

    let isParentActive = false
    let isMinimized = false
    let isLockedHorizontal = false
    let isAtTop = true

    const parentStore = getStore(ContentParentStore)
    const scrollStore = getStore(ScrollStore, { id })

    // TODO once reactions are finished to support doing all in one function
    // we can greatly simplify this area

    const update = () => {
      const isLarge = getMedia().lg
      const prevent =
        !isLarge &&
        isAtTop &&
        (isMinimized || !isParentActive || isLockedHorizontal)
      setPrevent(prevent)
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
      (x) => x.snapIndex > 0,
      function drawerStoreSnapIndexToPreventScroll(x) {
        isMinimized = x
        update()
      }
    )

    const d2 = reaction(
      scrollStore as any,
      (x) => [x.lock, x.isAtTop] as const,
      function scrollLockToPreventScroll([lock, t]) {
        isAtTop = t
        isLockedHorizontal = lock === 'horizontal'
        update()
      }
    )

    return () => {
      d0()
      d1()
      d2()
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
      setIsScrollAtTop(isAtTop)
      onScrollYThrottled?.(y)

      // calls the recyclerview scroll, we may want to not throttle this...
      if (props.onScroll) {
        props.onScroll(e)
      }

      if (isAtTop) {
        if (!scrollStore.isAtTop) {
          scrollStore.setIsAtTop(true)
        }
        scrollStore.setLock('none')
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
      const nextScrollAtTop = y <= 0
      const hasBeenAWhile = Date.now() - lastUpdate.current > 200
      if (nextScrollAtTop !== isScrollAtTop || hasBeenAWhile) {
        doUpdate(y, e)
      }
    }

    // memo because preventScrolling changes on media queries
    const childrenMemo = useMemo(() => {
      return children
    }, [children])
    const scrollRef = useRef<ScrollView | null>(null)

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
        <VStack
          flex={1}
          overflow="hidden"
          pointerEvents={preventScrolling ? 'none' : 'auto'}
        >
          <ScrollView
            ref={combineRefs(scrollRef, ref)}
            {...props}
            onScroll={setIsScrolling}
            {...(supportsTouchWeb && {
              onTouchMove: cancelTouchContentIfDrawerDragging,
              onTouchStart: cancelTouchContentIfDrawerDragging,
            })}
            // for native...
            // bounces={false}
            // bouncesZoom={false}
            // short duration to catch before vertical scroll
            scrollEventThrottle={14}
            // scrollEnabled={!preventScrolling}
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
