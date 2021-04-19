import { Store, createStore, getStore, useStoreInstance } from '@dish/use-store'
import React, { memo, useMemo } from 'react'
import { Animated, PanResponder, StyleSheet, View } from 'react-native'
import { VStack, useConstant } from 'snackui'

import { pageWidthMax, searchBarHeight, zIndexDrawer } from '../../constants/constants'
import { getWindowHeight } from '../../helpers/getWindow'
import { AppSearchBar } from '../AppSearchBar'
import { blurSearchInput } from '../AppSearchInput'
import { autocompletesStore } from '../AutocompletesStore'
import { drawerStore as ds } from '../drawerStore'
import { isTouchingSearchBar } from '../SearchInputNativeDragFix'
import { BottomSheetContainer } from '../views/BottomSheetContainer'
import { ScrollStore, isScrollAtTop, usePreventVerticalScroll } from '../views/ContentScrollView'
import { isScrollingSubDrawer } from '../views/ContentScrollViewHorizontal'

class HomeActiveContent extends Store {
  id = 'home'

  setId(next: string) {
    this.id = next
  }
}

export const homeActiveContent = createStore(HomeActiveContent)

export const HomeDrawerSmallView = memo((props: { children: any }) => {
  const drawerStore = useStoreInstance(ds)
  const { id } = useStoreInstance(homeActiveContent)
  const preventScrolling = usePreventVerticalScroll(id)

  const panResponder = useConstant(() => {
    const move = Animated.event([null, { dy: drawerStore.pan }], {
      useNativeDriver: false,
    })

    let curSnapY = 0
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => {
        if (isTouchingSearchBar) {
          return false
        }
        if (isScrollingSubDrawer) {
          return false
        }
        if (!isScrollAtTop && dy > 6) {
          return false
        }
        if (drawerStore.snapIndex === 2) {
          // try and prevent grabbing both horizontal + vertical
          return Math.abs(dy) > 12
        }
        if (drawerStore.snapIndex === 0) {
          return dy > 6
        }
        const scrollStore = getStore(ScrollStore, { id })
        if (scrollStore.lock === 'horizontal') {
          return false
        }
        const threshold = 6
        return Math.abs(dy) > threshold
      },
      onPanResponderGrant: (e, gestureState) => {
        drawerStore.spring?.stop()
        drawerStore.spring = null
        curSnapY = drawerStore.pan['_value']
        drawerStore.pan.setOffset(curSnapY)
        drawerStore.pan.setValue(0)
        drawerStore.setIsDragging(true)
        autocompletesStore.setVisible(false)
        blurSearchInput()
      },
      onPanResponderMove: (e, gestureState) => {
        const y = curSnapY + gestureState.dy
        const minY = getWindowHeight() * drawerStore.snapPoints[0] - 10
        const maxY = getWindowHeight() * drawerStore.snapPoints[2] + 10
        // limit movement (TODO make it "resist" at edge)
        if (y < minY) {
          return
        }
        if (y > maxY) {
          return
        }
        move(e, gestureState)
      },
      onPanResponderRelease: (e, gestureState) => {
        drawerStore.setIsDragging(false)
        drawerStore.pan.flattenOffset()
        const velocity = gestureState.vy
        drawerStore.animateDrawerToPx(drawerStore.pan['_value'], velocity)
      },
    })
  })

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
