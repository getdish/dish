import { Store, getStore, selector } from '@dish/use-store'
import React, {
  Suspense,
  createContext,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native'
import { combineRefs, useGet } from 'snackui'

import { isWeb } from '../../constants/constants'
import { isTouchDevice, supportsTouchWeb } from '../../constants/platforms'
import { getWindowHeight } from '../../helpers/getWindow'
import { drawerStore } from '../drawerStore'

export type ScrollLock = 'horizontal' | 'vertical' | 'drawer' | 'none'

export const scrollViews = new Map<string, ScrollView>()
export const scrollLastY = new Map<string, number>()
export const scrollCurY = new Map<string, number>()
export const isScrollAtTop = new Map<string, boolean>()

export class ScrollStore extends Store<{ id: string }> {
  lock: ScrollLock = 'none'
  isAtTop = true
  lastTouchEnd = Date.now()
  lastTouchStart = Date.now()
  scrollView: ScrollView | null = null

  setLock(val: ScrollLock) {
    this.lock = val
    if (val === 'horizontal') {
      drawerStore.setIsDragging(false)
    }
  }

  setIsAtTop(val: boolean) {
    this.isAtTop = val
  }

  scrollTo(val: { x?: number; y?: number; animated?: boolean }) {
    this.scrollView?.scrollTo(val)
  }
}

export class ContentParentStore extends Store {
  activeId = ''

  setActiveId(id: string) {
    this.activeId = id
  }
}

export const useScrollActive = (id: string) => {
  if (!id) {
    throw new Error(`no id`)
  }
  const [active, setActive] = useState(true)
  const getCurrent = useGet(active)

  useEffect(() => {
    if (isWeb && !supportsTouchWeb) {
      return
    }

    const parentStore = getStore(ContentParentStore)
    const scrollStore = getStore(ScrollStore, { id })

    return selector(function getContentScrollViewActive() {
      const isScrollAtTop = scrollStore.isAtTop
      const isLockedOnDrawer = scrollStore.lock === 'drawer'
      // const isSpringing = !!drawerStore.spring
      const isDraggingDrawer = drawerStore.isDragging
      const isFullyOpen = drawerStore.isAtTop
      const isParentActive = parentStore.activeId === id
      const active =
        isParentActive &&
        (isFullyOpen || !isScrollAtTop) &&
        // !isSpringing &&
        !isDraggingDrawer &&
        !isLockedOnDrawer

      // console.log({
      //   active,
      //   isParentActive,
      //   isFullyOpen,
      //   isScrollAtTop,
      //   // isSpringing,
      //   isDraggingDrawer,
      //   isLockedOnDrawer,
      //   parent: parentStore.activeId,
      // })

      if (active !== getCurrent()) {
        setActive(active)
      }
      return active
    })
  }, [id])

  return getCurrent
}

export const ContentScrollContext = createContext('id')

type ContentScrollViewProps = ScrollViewProps & {
  id: string
  children: any
  onScrollYThrottled?: Function
}

export const ContentScrollView = forwardRef<ScrollView, ContentScrollViewProps>(
  ({ children, onScrollYThrottled, style, id, ...props }, ref) => {
    // this updates when drawer moves to top
    // this is already handled in useScrollActive i think
    // const isActive = useStoreSelector(ContentParentStore, x => x.activeId === id, { id })
    // const isDraggingParent = useStoreInstanceSelector(drawerStore, x => isActive && x.isDragging, [isActive])
    const getScrollActive = useScrollActive(id)
    const lastUpdate = useRef<any>(0)
    const finish = useRef<any>(0)

    // note, not using it, not reacting
    const scrollStore = getStore(ScrollStore, { id })

    const THROTTLE_SCROLL = 100

    const doUpdate = (y: number, e: any) => {
      clearTimeout(finish.current)
      if (!drawerStore.isAtTop && !getScrollActive()) {
        return
      }
      const isAtTop = y <= 0
      isScrollAtTop.set(id, isAtTop)
      onScrollYThrottled?.(y)
      if (isAtTop) {
        if (!scrollStore.isAtTop) {
          scrollStore.setIsAtTop(true)
        }
        // safari desktop wants this
        if (scrollStore.lock === 'vertical') {
          scrollStore.setLock('none')
        }
        // DONT LOCK HERE WILL INTERFERE WITH VERTICAL SCROLL PULL DOWN
      } else {
        if (scrollStore.isAtTop) {
          scrollStore.setIsAtTop(false)
        }
        // if (isTouchDevice) {
        //   // this is handled below
        //   return
        // }
        if (scrollStore.lastTouchEnd > scrollStore.lastTouchStart) {
          // touch device prevent late scroll events causing issues
          return
        }
        if (scrollStore.lock === 'none') {
          scrollStore.setLock('vertical')
        }
        if (!isTouchDevice) {
          finish.current = setTimeout(() => {
            scrollStore.setLock('none')
          }, THROTTLE_SCROLL * 1.1)
        }
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
        scrollStore.scrollView = scrollRef.current
      }
    }, [id, scrollRef.current])

    const state = useRef<{ at: number; start: number; active: boolean; lastYs: number[] | null }>()
    if (!state.current) {
      state.current = {
        at: 0,
        start: 0,
        active: false,
        lastYs: null as number[] | null,
      }
    }

    const isScrollingVerticalFromTop = () => {
      return scrollStore.lock === 'vertical' && scrollStore.isAtTop
    }

    return (
      <ContentScrollContext.Provider value={id}>
        <ScrollView
          removeClippedSubviews
          ref={combineRefs(scrollRef, ref)}
          {...props}
          scrollEventThrottle={15}
          onScroll={(e) => {
            // calls the recyclerview scroll
            props.onScroll?.(e)
            const y = e.nativeEvent.contentOffset.y
            const atTop = y <= 0
            scrollCurY.set(id, y)
            // goin up
            if (state.current!.lastYs) {
              state.current!.lastYs = null
            }
            const hasBeenAWhile = Date.now() - lastUpdate.current > THROTTLE_SCROLL
            if (atTop !== isScrollAtTop.get(id) || hasBeenAWhile) {
              lastUpdate.current = Date.now()
              doUpdate(y, e)
            }
          }}
          onMomentumScrollEnd={({ nativeEvent }) => {
            scrollLastY.set(id, nativeEvent.contentOffset.y)
          }}
          {...(isTouchDevice && {
            onTouchStart() {
              scrollStore.lastTouchStart = Date.now()
            },
            onTouchEnd: () => {
              scrollStore.lastTouchEnd = Date.now()
              if (scrollStore.lock !== 'none') {
                scrollStore.setLock('none')
              }
            },
          })}
          // for native...
          bounces={isWeb ? true : false}
          // DONT USE THIS ON WEB IT CAUSES REFLOWS see classname above
          // oh well we have to deal with reapints, just try and time them
          scrollEnabled={getScrollActive()}
          style={[styles.scroll, style]}
        >
          <View
            style={{ flex: 1 }}
            onMoveShouldSetResponderCapture={isScrollingVerticalFromTop}
            onTouchMove={(e) => {
              // this handles when things are scrolling already
              // it moves the drawer once scroll goes above the top
              if (e.nativeEvent.touches.length !== 1) {
                return
              }
              console.log('>>', scrollStore.lock, scrollStore.isAtTop)
              if (!isScrollingVerticalFromTop()) {
                return
              }
              const ss = state.current!
              const pageY = e.nativeEvent.touches[0]?.pageY
              if (!ss.at) {
                ss.active = true
                ss.at = pageY
                ss.start = getWindowHeight() - drawerStore.currentSnapHeight
              }
              const start = getWindowHeight() - drawerStore.currentSnapHeight
              const pY = ss.at - pageY
              const y = start - pY
              if (y < drawerStore.minY) {
                console.warn('I DISABLED THIS', y, drawerStore.minY)
                drawerStore.setIsDragging(false)
                return
              }
              if (!ss.lastYs) {
                ss.lastYs = []
              }
              ss.lastYs.push(y)
              if (ss.lastYs.length > 15) {
                ss.lastYs = ss.lastYs.slice(0, 2)
              }
              if (!drawerStore.isDragging) {
                drawerStore.setIsDragging(true)
              }
              drawerStore._setY(y)
            }}
            onTouchEnd={(e) => {
              scrollStore.setLock('none')
              const ss = state.current!
              if (!ss.active) return
              ss.active = false
              ss.at = 0
              const vY = (() => {
                const ys = ss.lastYs
                if (!ys) return 10
                const num = ys.length
                return (
                  -ys
                    .map((cur, i) => {
                      const next = ys[i + 1]
                      return next ? cur - next : 0
                    })
                    .reduce((a, c) => a + c / num, 0) * 0.5
                )
              })()
              drawerStore.animateDrawerToPx(drawerStore.pan['_value'], vY)
            }}
          >
            <Suspense fallback={null}>{childrenMemo}</Suspense>
          </View>
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
