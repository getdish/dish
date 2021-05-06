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
import { ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native'
import { scrollTo } from 'react-native-reanimated'
import { VStack, combineRefs, getMedia, useMedia } from 'snackui'

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
    let isDraggingDrawer = false
    let isSpringing = false

    const parentStore = getStore(ContentParentStore)
    const scrollStore = getStore(ScrollStore, { id })

    // TODO once reactions are finished to support doing all in one function
    // we can greatly simplify this area

    const update = () => {
      const isLarge = getMedia().lg
      const isActive =
        isParentActive &&
        !isSpringing &&
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
      (x) => [!!x.spring, x.snapIndexName === 'bottom', x.isDragging] as const,
      function drawerStoreSnapIndexToPreventScroll([a, b, c]) {
        isSpringing = a
        isDraggingDrawer = b
        isMinimized = c
        update()
        if (isSpringing) {
          // max time before reverting
          const tm = setTimeout(() => {
            isSpringing = false
            update()
          }, 100)
          return () => clearTimeout(tm)
        }
      }
    )

    const d2 = reaction(
      scrollStore,
      (x) => x.lock === 'horizontal' || x.lock === 'drawer',
      function scrollLockToPreventScroll(val) {
        isLockedHorizontalOrDrawer = val
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

    const THROTTLE_SCROLL = 150

    const doUpdate = (y: number, e: any) => {
      clearTimeout(finish.current)
      const isAtTop = y <= 0
      isScrollAtTop.set(id, isAtTop)
      onScrollYThrottled?.(y)
      // calls the recyclerview scroll
      if (props.onScroll) {
        props.onScroll(e)
      }
      if (isAtTop) {
        if (!scrollStore.isAtTop) {
          scrollStore.setIsAtTop(true)
          scrollStore.setLock('none')
        }
        // DONT LOCK HERE WILL INTERFERE WITH VERTICAL SCROLL PULL DOWN
      } else {
        if (scrollStore.isAtTop) {
          scrollStore.setIsAtTop(false)
        }
        if (scrollStore.lock === 'none') {
          scrollStore.setLock('vertical')
        }
        finish.current = setTimeout(() => {
          scrollStore.setLock('none')
        }, THROTTLE_SCROLL * 1.3)
      }
    }

    // memo because preventScrolling changes on media queries
    const childrenMemo = useMemo(() => {
      return children
    }, [children])
    const scrollRef = useRef<ScrollView | null>(null)

    useEffect(() => {
      if (scrollRef.current) {
        const v = scrollRef.current
        const s = {
          ...v,
          scrollTo(y: number, x = 0, animated = false) {
            console.log('proxy scroll', y, animated ? 'ANIMATED' : '')
            scrollTo(scrollRef, x, y, animated)
          },
        } as ScrollView
        scrollViews.set(id, v) //s)
      }
    }, [id, scrollRef.current])

    const scrollState = useRef({
      at: 0,
      start: 0,
      active: false,
      lastYs: null as number[] | null,
    })

    const isScrollingVerticalFromTop = () => {
      return (
        (scrollStore.lock === 'vertical' || scrollStore.lock === 'none') &&
        scrollStore.isAtTop &&
        drawerStore.snapIndexName === 'top'
      )
    }

    return (
      <ContentScrollContext.Provider value={id}>
        <VStack flex={1} overflow="hidden" pointerEvents={preventScrolling ? 'none' : undefined}>
          <ScrollView
            ref={combineRefs(scrollRef, ref)}
            {...props}
            onScroll={(e) => {
              const y = e.nativeEvent.contentOffset.y
              const atTop = y <= 0
              scrollCurY.set(id, y)
              // goin up
              if (scrollState.current.lastYs) {
                scrollState.current.lastYs = null
              }
              if (atTop && scrollStore.lock === 'drawer') {
                return
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
            scrollEventThrottle={16}
            style={[styles.scroll, style]}
          >
            <View
              style={{ flex: 1 }}
              onMoveShouldSetResponderCapture={isScrollingVerticalFromTop}
              onTouchMove={(e) => {
                if (e.nativeEvent.touches.length !== 1) {
                  return
                }
                if (!isScrollingVerticalFromTop()) {
                  return
                }
                const ss = scrollState.current
                const pageY = e.nativeEvent.touches[0]?.pageY
                if (!ss.at) {
                  ss.active = true
                  ss.at = pageY
                  ss.start = getWindowHeight() - drawerStore.currentHeight
                }
                const start = getWindowHeight() - drawerStore.currentHeight
                const pY = ss.at - pageY
                const y = start - pY
                if (y < drawerStore.minY) {
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
                drawerStore.pan.setValue(y)
              }}
              onTouchEnd={(e) => {
                const ss = scrollState.current
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
