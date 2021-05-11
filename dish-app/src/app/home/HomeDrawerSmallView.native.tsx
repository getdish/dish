import { AssertionError } from '@dish/helpers'
import { getStore, useStore } from '@dish/use-store'
import React, { memo, useMemo, useRef } from 'react'
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  View,
} from 'react-native'
import { VStack } from 'snackui'

import { pageWidthMax, searchBarHeight, zIndexDrawer } from '../../constants/constants'
import { getWindowHeight } from '../../helpers/getWindow'
import { AppAutocompleteLocation } from '../AppAutocompleteLocation'
import { AppAutocompleteSearch } from '../AppAutocompleteSearch'
import { AppSearchBar } from '../AppSearchBar'
import { blurSearchInput } from '../AppSearchInput'
import { autocompletesStore } from '../AutocompletesStore'
import { drawerStore } from '../drawerStore'
import { isTouchingSearchBar } from '../SearchInputNativeDragFix'
import { BottomSheetContainer } from '../views/BottomSheetContainer'
import {
  ContentParentStore,
  ScrollStore,
  isScrollAtTop,
  scrollLastY,
  scrollViews,
} from '../views/ContentScrollView'

let isTouchingHandle = false
let isPanActive = false

export const HomeDrawerSmallView = memo((props: { children: any }) => {
  const contentParent = useStore(ContentParentStore)
  const panViewRef = useRef()
  // const preventScrolling = usePreventVerticalScroll(contentParent.activeId)

  const pan = useMemo(() => {
    let curSnapY = 0
    let curScrollerYMove = -1

    const minY = getWindowHeight() * drawerStore.snapPoints[0]
    const maxY = getWindowHeight() * drawerStore.snapPoints[2]

    const getShouldActivate = (_e: GestureResponderEvent, g: PanResponderGestureState): boolean => {
      const dy = g.dy ?? drawerStore.pan['_value']
      if (isTouchingHandle) {
        return true
      }
      if (isTouchingSearchBar) {
        return Math.abs(dy) > 8
      }
      if (isPanActive) {
        return true
      }
      // is touching main area
      try {
        const isScrolledToTop = isScrollAtTop.get(contentParent.activeId) ?? true
        const { snapIndexName } = drawerStore
        if (isScrolledToTop && snapIndexName === 'top' && dy > 6) {
          return true
        }
        const scroll = getStore(ScrollStore, { id: contentParent.activeId })
        if (curScrollerYMove > 0 || !scroll.isAtTop) {
          return false
        }
        // prettier-ignore
        // console.log('should?', store.lock, { isPanActive, isTouchingHandle, isTouchingSearchBar })
        if (scroll.lock === 'horizontal' || scroll.lock === 'vertical') {
          return false
        }
        // if at top, we avoid checking lock
        if (!isScrolledToTop && snapIndexName === 'top') {
          return false
        }
        // horizontal prevent
        if (Math.abs(g.dx) > 8) {
          return false
        }
        if (snapIndexName === 'bottom') {
          return true
        }
        if (snapIndexName === 'top') {
          return true
        }
        const threshold = 6
        const isAboveYThreshold = Math.abs(dy) > threshold
        return isAboveYThreshold
      } catch (err) {
        if (!(err instanceof AssertionError)) {
          console.error(err.message, err.stack)
        }
      }
      return false
    }

    const responder = PanResponder.create({
      // onStartShouldSetPanResponderCapture(e, { dy }) {
      //   return getShouldActivate(dy)
      // },
      onMoveShouldSetPanResponder: getShouldActivate,
      onPanResponderGrant: (e, gestureState) => {
        isPanActive = true
        curScrollerYMove = -1
        // may just want to call drawerStore.finishSpring
        drawerStore.spring?.stop()
        drawerStore.spring = null
        curSnapY = drawerStore.currentSnapPx //Math.max(minY, Math.min(maxY, drawerStore.pan['_value']))
        const scrollStore = getStore(ScrollStore, { id: contentParent.activeId })
        if (scrollStore.lock !== 'drawer') {
          scrollStore.setLock('drawer')
        }
        drawerStore.pan.setOffset(curSnapY)
        drawerStore._setY(0)
        if (!drawerStore.isDragging) {
          drawerStore.setIsDragging(true)
        }
        if (autocompletesStore.visible) {
          autocompletesStore.setVisible(false)
        }
        blurSearchInput()
      },
      onPanResponderReject: (e, g) => {
        isPanActive = false
      },
      onPanResponderTerminate: () => {
        isPanActive = false
      },
      onPanResponderMove: (e, { dy }) => {
        const y = curSnapY + dy
        // limit movement (TODO make it "resist" at edge)
        const scroller = scrollViews.get(contentParent.activeId)
        if (y < minY || curScrollerYMove >= 0) {
          if (!scroller) return
          drawerStore.isAtTop = true
          const curY = scrollLastY.get(contentParent.activeId) ?? 0
          curScrollerYMove = curY + minY - y
          scroller.scrollTo({ y: curScrollerYMove, animated: false })
          return
        }
        if (y <= minY) {
          return
        }
        if (y >= maxY) {
          return
        }
        // console.log('pan move', y, dy, 'vs', drawerStore.pan['_value'])
        drawerStore._setY(Math.round(dy))
      },
      onPanResponderRelease: (e, { vy }) => {
        isPanActive = false
        const scrollStore = getStore(ScrollStore, { id: contentParent.activeId })
        if (scrollStore.lock !== 'none') {
          scrollStore.setLock('none')
        }
        drawerStore.pan.flattenOffset()
        const scrolledY = curScrollerYMove
        curScrollerYMove = -1
        if (scrolledY > 0) {
          const scroller = scrollViews.get(contentParent.activeId)
          if (scroller) {
            const y = scrolledY + -vy * 16
            console.log('thrown to', y, vy)
            scroller.scrollTo({ y })
            drawerStore.setSnapIndex(0)
            return
          }
        }
        drawerStore.animateDrawerToPx(drawerStore.pan['_value'], vy)
      },
    })

    // responder.panHandlers = Object.keys(responder.panHandlers).reduce((acc, cur) => {
    //   console.log('---', cur)
    //   const og = responder.panHandlers[cur]
    //   acc[cur] = (...args) => {
    //     const res = og(...args)
    //     console.log('>>>>', cur, args, 'return', res)
    //     return res
    //   }
    //   return acc
    // }, {})

    return responder
  }, [])

  return (
    <VStack pointerEvents="none" zIndex={zIndexDrawer} width="100%" height="100%" maxHeight="100%">
      <Animated.View
        style={[
          styles.animatedView,
          {
            transform: [
              {
                translateY: drawerStore.pan,
              },
            ],
          },
        ]}
      >
        {/* handle */}
        <View
          pointerEvents="auto"
          style={styles.handle}
          onTouchStart={() => {
            isTouchingHandle = true
          }}
          onTouchEnd={() => {
            isTouchingHandle = false
          }}
          {...pan.panHandlers}
        >
          <VStack
            pointerEvents="auto"
            paddingHorizontal={20}
            paddingVertical={20}
            onPress={drawerStore.toggleDrawerPosition}
            alignSelf="center"
          >
            <VStack
              backgroundColor="rgba(100,100,100,0.35)"
              width={60}
              height={8}
              borderRadius={100}
            />
          </VStack>
        </View>

        {/* DONT OVERLAY BECAUSE WE NEED HORIZONTAL SCROLLING */}
        {/* SEE CONTENTSCROLLVIEW FOR PREVENTING SCROLL */}

        <VStack width="100%" flex={1}>
          {useMemo(
            () => (
              <BottomSheetContainer>
                <View ref={panViewRef as any} style={styles.container} {...pan.panHandlers}>
                  <VStack zIndex={1000} maxHeight={searchBarHeight}>
                    <AppSearchBar />
                  </VStack>
                  <VStack position="relative" flex={1}>
                    <AppAutocompleteLocation />
                    <AppAutocompleteSearch />
                    {props.children}
                  </VStack>
                </View>
              </BottomSheetContainer>
            ),
            [props.children]
          )}
        </VStack>
      </Animated.View>
    </VStack>
  )
})

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  animatedView: {
    maxWidth: pageWidthMax,
    width: '100%',
    position: 'absolute',
    height: '100%',
  },
  handle: {
    position: 'absolute',
    top: -40,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
})
