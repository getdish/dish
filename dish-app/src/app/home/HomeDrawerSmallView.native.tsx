import { AssertionError, assert } from '@dish/helpers'
import { useStore, useStoreInstance } from '@dish/use-store'
import React, { memo, useMemo } from 'react'
import { Animated, PanResponder, ScrollView, StyleSheet, View } from 'react-native'
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
  isScrollAtTop,
  scrollViews,
  scrollYs,
  usePreventVerticalScroll,
} from '../views/ContentScrollView'
import { isScrollLocked } from '../views/useScrollLock'

export const HomeDrawerSmallView = memo((props: { children: any }) => {
  const drawer = useStoreInstance(drawerStore)
  const contentParent = useStore(ContentParentStore)
  const preventScrolling = usePreventVerticalScroll(contentParent.activeId)

  const panResponder = useConstant(() => {
    const move = Animated.event(
      // [x, y] mapping
      [null, { dy: drawer.pan }],
      {
        useNativeDriver: false,
      }
    )

    let curSnapY = 0
    let curScrollerYMove = -1

    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => {
        try {
          assert(!isTouchingSearchBar, 'touching searchbar')
          const isAtTop = isScrollAtTop.get(contentParent.activeId)
          // if at top, we avoid checking lock
          if (!isAtTop) {
            assert(!isScrollLocked(contentParent.activeId), 'scroll locked')
          }
          assert(isAtTop || dy <= 6, 'scrolled down a bit while dragging up')
          if (drawer.snapIndex === 2) {
            // try and prevent grabbing both horizontal + vertical
            return Math.abs(dy) > 12
          }
          if (drawer.snapIndex === 0) {
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
      },
      onPanResponderGrant: (e, gestureState) => {
        curScrollerYMove = -1
        drawer.spring?.stop()
        drawer.spring = null
        curSnapY = drawer.pan['_value']
        drawer.pan.setOffset(curSnapY)
        drawer.pan.setValue(0)
        drawer.setIsDragging(true)
        autocompletesStore.setVisible(false)
        blurSearchInput()
      },
      onPanResponderMove: (e, gestureState) => {
        const y = curSnapY + gestureState.dy
        const minY = getWindowHeight() * drawer.snapPoints[0] - 10
        const maxY = getWindowHeight() * drawer.snapPoints[2] + 10
        // limit movement (TODO make it "resist" at edge)
        const scroller = scrollViews.get(contentParent.activeId)
        if (y < minY) {
          if (!scroller) return
          const curY = scrollYs.get(contentParent.activeId) ?? 0
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
        drawer.setIsDragging(false)
        drawer.pan.flattenOffset()
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

        drawer.animateDrawerToPx(drawer.pan['_value'], velocity)
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
                  translateY: drawer.pan,
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
            onPress={drawer.toggleDrawerPosition}
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
