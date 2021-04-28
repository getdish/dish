import { Store, getStore, reaction } from '@dish/use-store'
import React, {
  Suspense,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  PanResponder,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  Touchable,
  View,
} from 'react-native'
import { prevent, useConstant } from 'snackui'
import { VStack, combineRefs, getMedia, useMedia } from 'snackui'

import { isWeb } from '../../constants/constants'
import { isTouchDevice, supportsTouchWeb } from '../../constants/platforms'
import { getWindowHeight } from '../../helpers/getWindow'
import { drawerStore } from '../drawerStore'
import { X } from '../home/HomeDrawerSmallView.native'

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
  if (!id) {
    throw new Error(`no id`)
  }

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
      console.log(id, {
        isParentActive,
        isMinimized,
        isDraggingDrawer,
        isLarge,
        isLockedHorizontalOrDrawer,
      })
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
      (x) => x.snapIndex === 2,
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
        isLockedHorizontalOrDrawer = lock === 'horizontal' || lock === 'drawer'
        update()
      }
    )

    const d3 = reaction(
      drawerStore,
      (x) => x.isDragging,
      function parentStoreActiveIdToPreventScroll(next) {
        console.log('GOT UPDATE DRAG', next)
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
    const xxx = useContext(X)
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
      if (isAtTop) {
        console.log('AT TOP ^^^')
      }
      isScrollAtTop.set(id, isAtTop)
      onScrollYThrottled?.(y)

      // calls the recyclerview scroll
      if (props.onScroll) {
        props.onScroll(e)
      }

      if (isAtTop) {
        if (!scrollStore.isAtTop) {
          scrollStore.setIsAtTop(true)
        }
        console.log('\n\n\nlets do it from here...\n\n\n')
        // @ts-ignore
        // drawerStore.pan.setValue(-y)
        // scrollStore.setLock('none')
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
      if (atTop && scrollStore.lock === 'drawer') {
        return
      }
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

    // useEffect(() => {
    //   console.log('drawerStore_.isDragging', drawerStore_.isDragging)
    // }, [drawerStore_.isDragging])

    console.log('>>ContentScrollView<<', id, preventScrolling)
    const scrollState = useRef({
      at: 0,
      active: false,
    })

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
            // onMoveShouldSetResponderCapture={() => scrollStore.lock !== 'drawer'}
            // onStartShouldSetResponder={() => scrollStore.lock !== 'drawer'}
            // for native...
            bounces={false}
            // onStartShouldSetResponder={() => false}
            // onMoveShouldSetResponder={() => false}
            // onMoveShouldSetResponderCapture={() => false}
            // onStartShouldSetResponderCapture={() => false}
            scrollEnabled={!preventScrolling}
            // short duration to catch before vertical scroll
            scrollEventThrottle={8}
            style={[styles.scroll, style]}
          >
            <View
              style={{ flex: 1 }}
              onMoveShouldSetResponderCapture={() => {
                return scrollStore.isAtTop
              }}
              onTouchMove={(e) => {
                if (scrollStore.isAtTop && drawerStore.snapIndex === 0) {
                  if (!scrollState.current.active) {
                    scrollState.current.active = true
                    scrollState.current.at = e.nativeEvent.pageY
                  }
                  const start = getWindowHeight() - drawerStore.currentHeight
                  const y = scrollState.current.at - e.nativeEvent.pageY
                  drawerStore.pan.setValue(start - y)
                }
              }}
              onTouchEnd={() => {
                if (scrollState.current.active) {
                  scrollState.current.active = false
                  console.log('finish')
                  drawerStore.animateDrawerToPx(drawerStore.pan['_value'], 0)
                }
              }}
            >
              <Suspense fallback={null}>{childrenMemo}</Suspense>
            </View>

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
