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

// export const getIsTouchingHandle = () => isTouchingHandle

export const HomeDrawerSmallView = memo((props: { children: any }) => {
  const contentParent = useStore(ContentParentStore)
  const panViewRef = useRef()
  // const preventScrolling = usePreventVerticalScroll(contentParent.activeId)

  const pan = useMemo(() => {
    let curSnapY = 0
    let curScrollerYMove = -1

    const minY = getWindowHeight() * drawerStore.snapPoints[0]
    const maxY = getWindowHeight() * drawerStore.snapPoints[2]

    const getShouldActivate = (
      _e: GestureResponderEvent,
      { dy, dx }: PanResponderGestureState
    ): boolean => {
      if (isTouchingHandle) {
        return true
      }
      if (isPanActive) {
        return true
      }
      const dyAbs = Math.abs(dy)
      const dxAbs = Math.abs(dx)
      const isMovingHorizontal = dxAbs > 8 && dxAbs > dyAbs
      if (isMovingHorizontal) {
        return false
      }
      if (isTouchingSearchBar) {
        return dyAbs > 8
      }
      // is touching main area
      try {
        const isScrolledToTop = isScrollAtTop.get(contentParent.activeId) ?? true
        const { snapIndexName } = drawerStore
        const scrollStore = getStore(ScrollStore, { id: contentParent.activeId })
        const isScrollingUpFromTop = isScrolledToTop && snapIndexName === 'top' && dy > 6
        // prettier-ignore
        // console.log('should?', scroll.lock, { isScrolledToTop, snapIndexName, dy, dx, isScrollingUpFromTop })
        if (isScrollingUpFromTop) {
          // this is handled in ContentScrollView onTouchMove
          return true
        }
        const isScrollingDownFromTop = isScrolledToTop && snapIndexName === 'top' && dy < 0
        if (isScrollingDownFromTop) {
          // let natural scroller handle
          return false
        }
        if (curScrollerYMove > 0 || !scrollStore.isAtTop) {
          return false
        }
        if (scrollStore.lock === 'horizontal' || scrollStore.lock === 'vertical') {
          return false
        }
        if (snapIndexName === 'bottom') {
          return true
        }
        if (!isScrolledToTop && snapIndexName === 'middle' && dy < 6) {
          return true
        }
        const isMovingVertical = dyAbs > dxAbs && dyAbs > 6
        return isMovingVertical
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
        console.log('curSnapY', curSnapY)
        drawerStore.pan.setOffset(0)
        drawerStore._setY(curSnapY)
        const scrollStore = getStore(ScrollStore, { id: contentParent.activeId })
        if (scrollStore.lock !== 'drawer') {
          scrollStore.setLock('drawer')
        }
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
          // drawerStore.isAtTop = true
          const curY = scrollLastY.get(contentParent.activeId) ?? 0
          curScrollerYMove = curY + minY - y
          scroller.scrollTo({ y: curScrollerYMove, animated: false })
          const scrollStore = getStore(ScrollStore, { id: contentParent.activeId })
          if (scrollStore.lock === 'none') {
            scrollStore.setLock('vertical')
          }
          return
        }
        if (y <= minY) {
          return
        }
        if (y >= maxY) {
          return
        }
        // console.log('pan move', y, dy, 'vs', drawerStore.pan['_value'])
        drawerStore._setY(curSnapY + Math.round(dy))
      },
      onPanResponderRelease: (e, { vy }) => {
        console.log('released')
        isPanActive = false
        const scrollStore = getStore(ScrollStore, { id: contentParent.activeId })
        drawerStore.pan.flattenOffset()
        const scrolledY = curScrollerYMove
        curScrollerYMove = -1
        if (scrolledY > 0) {
          const scroller = scrollViews.get(contentParent.activeId)
          window['scroller'] = scroller
          if (scroller) {
            const y = Math.round(scrolledY + -vy * 10)
            console.log('thrown to', scroller, scrolledY, y, vy, scrollStore.lock)
            scroller.scrollTo({ y, x: 0, animated: true })
            // hacky... let it animate a bit before unlocking...
            setTimeout(() => {
              drawerStore.setSnapIndex(0, false)
              scrollStore.setLock('none')
            }, 150)
            return
          }
        }
        if (scrollStore.lock !== 'none') {
          scrollStore.setLock('none')
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
    <Animated.View
      pointerEvents="box-none"
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

      {useMemo(
        () => (
          <BottomSheetContainer>
            <View ref={panViewRef as any} style={styles.container} {...pan.panHandlers}>
              <VStack height={searchBarHeight} zIndex={1000}>
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
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  animatedView: {
    zIndex: zIndexDrawer,
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
