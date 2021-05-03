import { AssertionError } from '@dish/helpers'
import { getStore, useStore } from '@dish/use-store'
import React, { memo, useMemo } from 'react'
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
  // const preventScrolling = usePreventVerticalScroll(contentParent.activeId)

  const pan = useMemo(() => {
    const move = Animated.event(
      // [x, y] mapping
      [null, { dy: drawerStore.pan }],
      {
        useNativeDriver: true,
      }
    )

    let curSnapY = 0
    let curScrollerYMove = -1

    const minY = getWindowHeight() * drawerStore.snapPoints[0] - 10
    const maxY = getWindowHeight() * drawerStore.snapPoints[2] + 10

    const getShouldActivate = (_e: GestureResponderEvent, g: PanResponderGestureState): boolean => {
      const dy = g.dy ?? drawerStore.pan['_value']
      try {
        const store = getStore(ScrollStore, { id: contentParent.activeId })
        // prettier-ignore
        console.log('should?', store.lock, { isPanActive, isTouchingHandle, isTouchingSearchBar })
        if (store.lock === 'horizontal' || store.lock === 'vertical') {
          return false
        }
        if (isPanActive) {
          return true
        }
        if (isTouchingHandle) {
          return true
        }
        if (isTouchingSearchBar) {
          return Math.abs(dy) > 8
        }
        const { snapIndexName } = drawerStore
        const isScrolledToTop = isScrollAtTop.get(contentParent.activeId) ?? true
        // if at top, we avoid checking lock
        if (!isScrolledToTop && snapIndexName === 'top') {
          return false
        }
        // horizontal prevent
        if (Math.abs(g.dx) > 8) {
          console.log('horizontal, ignore')
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
        drawerStore.spring?.stop()
        drawerStore.spring = null
        console.log('cur pan val', drawerStore.pan['_value'], drawerStore.currentSnapPx)
        curSnapY = drawerStore.currentSnapPx //Math.max(minY, Math.min(maxY, drawerStore.pan['_value']))
        const scrollStore = getStore(ScrollStore, { id: contentParent.activeId })
        if (scrollStore.lock !== 'drawer') {
          scrollStore.setLock('drawer')
        }
        drawerStore.pan.setOffset(curSnapY)
        drawerStore.pan.setValue(0)
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
        if (y < minY || curScrollerYMove > 0) {
          if (!scroller) return
          const curY = scrollLastY.get(contentParent.activeId) ?? 0
          curScrollerYMove = curY + minY - y
          console.log('pan moving scroll', curScrollerYMove)
          scroller.scrollTo({ y: curScrollerYMove, animated: false })
          return
        }
        if (y > maxY || y < minY) {
          console.log('out of bounds')
          return
        }
        // console.log('pan move', y, dy, 'vs', drawerStore.pan['_value'])
        drawerStore.pan.setValue(dy)
      },
      onPanResponderRelease: (e, { vy }) => {
        isPanActive = false
        const scrollStore = getStore(ScrollStore, { id: contentParent.activeId })
        if (scrollStore.lock !== 'none') {
          scrollStore.setLock('none')
        }
        drawerStore.setIsDragging(false)
        drawerStore.pan.flattenOffset()
        const scrolledY = curScrollerYMove
        curScrollerYMove = -1
        if (scrolledY !== -1) {
          const scroller = scrollViews.get(contentParent.activeId)
          if (scroller) {
            scroller.scrollTo({ y: scrolledY + -vy * 6 })
            drawerStore.setSnapIndex(0)
            return
          }
        }
        drawerStore.animateDrawerToPx(drawerStore.pan['_value'], vy)
      },
    })

    // responder.panHandlers = Object.keys(responder.panHandlers).reduce((acc, cur) => {
    //   console.log('what is', cur)
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
          style={styles.panView}
          onTouchStart={() => {
            isTouchingHandle = true
          }}
          onTouchEnd={() => (isTouchingHandle = false)}
          {...pan.panHandlers}
        >
          <VStack
            pointerEvents="auto"
            paddingHorizontal={20}
            paddingVertical={20}
            onPress={drawerStore.toggleDrawerPosition}
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
                <View style={styles.container} {...pan.panHandlers}>
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
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  panView: {
    position: 'absolute',
    top: -40,
    padding: 5,
  },
})
