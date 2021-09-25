import { AssertionError } from '@dish/helpers'
import { getStore } from '@dish/use-store'
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

import {
  isNative,
  isWeb,
  pageWidthMax,
  searchBarHeight,
  zIndexDrawer,
} from '../../constants/constants'
import { getWindowHeight } from '../../helpers/getWindow'
import { AppAutocompleteLocation } from '../AppAutocompleteLocation'
import { AppAutocompleteSearch } from '../AppAutocompleteSearch'
import { AppSearchBarInline } from '../AppSearchBarInline'
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
import { AppFloatingTagMenuBar } from './AppFloatingTagMenuBar'

let isTouchingHandle = false
let isPanActive = false
const getActiveParentId = () => {
  return getStore(ContentParentStore).activeId
}

export const HomeDrawerSmallView = memo((props: { children: any }) => {
  const panViewRef = useRef()
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
      const MIN_DISTANCE = isWeb ? 6 : 10
      const isMovingHorizontal = dxAbs > MIN_DISTANCE && dxAbs > dyAbs
      if (isMovingHorizontal) {
        return false
      }
      if (isTouchingSearchBar) {
        return dyAbs > MIN_DISTANCE
      }
      // is touching main area
      try {
        const isScrolledToTop = isScrollAtTop.get(getActiveParentId()) ?? true
        const { snapIndexName } = drawerStore
        const scrollStore = getStore(ScrollStore, { id: getActiveParentId() })
        const isScrollingUpFromTop = isScrolledToTop && snapIndexName === 'top' && dy > 6
        // prettier-ignore
        // console.log('should?', scroll.lock, { isScrolledToTop, snapIndexName, dy, dx, isScrollingUpFromTop })
        if (isScrollingUpFromTop) {
          // native fixes scroll up then drag
          if (scrollStore.lock === 'vertical') {
            return false
          }
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
        const scrollStore = getStore(ScrollStore, { id: getActiveParentId() })
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
        const scroller = scrollViews.get(getActiveParentId())
        console.log('scroller', scroller)
        if (y < minY || curScrollerYMove >= 0) {
          if (!scroller) return
          // drawerStore.isAtTop = true
          const curY = scrollLastY.get(getActiveParentId()) ?? 0
          curScrollerYMove = curY + minY - y
          scroller.scrollTo({ y: curScrollerYMove, animated: false })
          const scrollStore = getStore(ScrollStore, { id: getActiveParentId() })
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
        isPanActive = false
        const scrollStore = getStore(ScrollStore, { id: getActiveParentId() })
        drawerStore.pan.flattenOffset()
        const scrolledY = curScrollerYMove
        curScrollerYMove = -1
        if (scrolledY > 0) {
          const scroller = scrollViews.get(getActiveParentId())
          window['scroller'] = scroller
          if (scroller) {
            const y = Math.round(scrolledY + -vy * 10)
            // console.log('thrown to', scroller, scrolledY, y, vy, scrollStore.lock)
            if (isNative) {
              console.log('avoiding throw, seemed like it was freezing UI for a while, checking')
              return null
            }
            console.log('scroller', scroller)
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

    return responder
  }, [])

  return (
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
      <AppFloatingTagMenuBar />

      {/* DONT OVERLAY BECAUSE WE NEED HORIZONTAL SCROLLING */}
      {/* SEE CONTENTSCROLLVIEW FOR PREVENTING SCROLL */}

      {useMemo(
        () => (
          <BottomSheetContainer>
            <View ref={panViewRef as any} style={styles.container} {...pan.panHandlers}>
              <VStack height={searchBarHeight} zIndex={1000}>
                <AppSearchBarInline />
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
