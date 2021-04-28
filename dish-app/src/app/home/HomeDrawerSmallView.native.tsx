import { AssertionError, assert } from '@dish/helpers'
import { getStore, useStore } from '@dish/use-store'
import React, { memo, useMemo } from 'react'
import { Animated, PanResponder, StyleSheet, View } from 'react-native'
import { VStack, useConstant } from 'snackui'

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
  usePreventVerticalScroll,
} from '../views/ContentScrollView'
import { isScrollLocked } from '../views/useScrollLock'

export const HomeDrawerSmallView = memo((props: { children: any }) => {
  const contentParent = useStore(ContentParentStore)
  const preventScrolling = usePreventVerticalScroll(contentParent.activeId)

  const panResponder = useConstant(() => {
    const move = Animated.event(
      // [x, y] mapping
      [null, { dy: drawerStore.pan }],
      {
        useNativeDriver: false,
      }
    )

    let curSnapY = 0
    let curScrollerYMove = -1

    const minY = getWindowHeight() * drawerStore.snapPoints[0] - 10
    const maxY = getWindowHeight() * drawerStore.snapPoints[2] + 10

    const getShouldActivate = (dy: number) => {
      try {
        if (isTouchingSearchBar) {
          return dy > 6
        }
        const isAtTop = isScrollAtTop.get(contentParent.activeId) ?? true
        // if at top, we avoid checking lock
        if (!isAtTop) {
          return false
          assert(!isScrollLocked(contentParent.activeId), 'scroll locked')
        }
        if (drawerStore.snapIndex === 2) {
          // try and prevent grabbing both horizontal + vertical
          return Math.abs(dy) > 12
        }
        if (drawerStore.snapIndex === 0) {
          return dy > 6
        }
        const threshold = 6
        return Math.abs(dy) > threshold
      } catch (err) {
        if (!(err instanceof AssertionError)) {
          console.error(err.message, err.stack)
        }
      }
      return false
    }

    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => {
        const should = getShouldActivate(dy)
        console.log('should', should)
        return should
      },
      onPanResponderGrant: (e, gestureState) => {
        curScrollerYMove = -1
        drawerStore.spring?.stop()
        drawerStore.spring = null
        curSnapY = Math.max(minY, Math.min(maxY, drawerStore.pan['_value']))
        const scrollStore = getStore(ScrollStore, { id: contentParent.activeId })
        scrollStore.setLock('drawer')
        drawerStore.pan.setOffset(curSnapY)
        drawerStore.pan.setValue(0)
        drawerStore.setIsDragging(true)
        autocompletesStore.setVisible(false)
        blurSearchInput()
      },
      // onMoveShouldSetPanResponderCapture: (e, { dy }) => {
      //   return getShouldActivate(dy)
      // },
      // onPanResponderTerminationRequest: (e, { dy }) => {
      //   console.log(e)
      //   return getShouldActivate(dy)
      // },
      onStartShouldSetPanResponder(e, g) {
        console.log('SHOULD___________')
        return getShouldActivate(g.dy)
      },
      onPanResponderReject: (e) => {
        console.log('rejected!!!!!!!!!', e)
      },
      onPanResponderTerminate: () => {
        console.log('terminated????????')
      },
      onPanResponderMove: (e, gestureState) => {
        const y = curSnapY + gestureState.dy
        // limit movement (TODO make it "resist" at edge)
        const scroller = scrollViews.get(contentParent.activeId)
        if (y < minY) {
          if (!scroller) return
          const curY = scrollLastY.get(contentParent.activeId) ?? 0
          curScrollerYMove = curY + minY - y
          scroller.scrollTo({ y: curScrollerYMove, animated: false })
          return
        }
        if (y > maxY) {
          return
        }
        move(e, gestureState)
      },
      onPanResponderRelease: (e, gestureState) => {
        const scrollStore = getStore(ScrollStore, { id: contentParent.activeId })
        scrollStore.setLock('none')
        drawerStore.setIsDragging(false)
        drawerStore.pan.flattenOffset()
        const velocity = gestureState.vy

        const scrolledY = curScrollerYMove
        curScrollerYMove = -1
        if (scrolledY !== -1) {
          const scroller = scrollViews.get(contentParent.activeId)
          if (scroller) {
            console.log('finish scroll via drag')
            scroller.scrollTo({ y: scrolledY + -velocity * 2 })
            return
          }
        }

        drawerStore.animateDrawerToPx(drawerStore.pan['_value'], velocity)
      },
    })
  })

  return (
    <VStack pointerEvents="none" zIndex={zIndexDrawer} width="100%" height="100%" maxHeight="100%">
      <Animated.View
        style={useMemo(
          () => [
            styles.animatedView,
            {
              transform: [
                {
                  translateY: drawerStore.pan,
                },
              ],
            },
          ],
          []
        )}
      >
        {/* handle */}
        <View pointerEvents="auto" style={styles.panView} {...panResponder.panHandlers}>
          <VStack
            pointerEvents="auto"
            paddingHorizontal={20}
            paddingVertical={20}
            marginTop={-10}
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

        <VStack width="100%" flex={1} pointerEvents={preventScrolling ? 'none' : 'auto'}>
          {useMemo(
            () => (
              <BottomSheetContainer>
                <View style={styles.container} {...panResponder.panHandlers}>
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
    top: -30,
    padding: 5,
  },
})
