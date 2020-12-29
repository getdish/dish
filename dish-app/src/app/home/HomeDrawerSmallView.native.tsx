import { useStore, useStoreInstance } from '@dish/use-store'
import React, { memo, useMemo } from 'react'
import { Animated, PanResponder, StyleSheet, View } from 'react-native'
import { VStack } from 'snackui'

import { autocompletesStore } from '../AppAutocomplete'
import { AppSearchBar } from '../AppSearchBar'
import { blurSearchInput } from '../AppSearchInput'
import { drawerStore as drawerStoreInstance } from '../DrawerStore'
import { BottomSheetContainer } from '../views/BottomSheetContainer'
import { pageWidthMax, searchBarHeight, zIndexDrawer } from '../../constants/constants'
import { getWindowHeight } from '../../helpers/getWindow'
import { isTouchingSearchBar } from '../SearchInputNativeDragFix'
import { isScrollAtTop } from '../views/ContentScrollView'
import { isScrollingSubDrawer } from '../views/ContentScrollViewHorizontal'

export const HomeDrawerSmallView = memo((props: { children: any }) => {
  const drawerStore = useStoreInstance(drawerStoreInstance)

  const panResponder = useMemo(() => {
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
          return Math.abs(dy) > 6
        }
        if (drawerStore.snapIndex === 0) {
          return dy > 6
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
  }, [])

  const content = useMemo(
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
  )

  return (
    <VStack
      pointerEvents="none"
      zIndex={zIndexDrawer}
      width="100%"
      height="100%"
      maxHeight="100%"
    >
      <Animated.View
        style={{
          transform: [
            {
              translateY: drawerStore.pan,
            },
          ],
          maxWidth: pageWidthMax,
          alignItems: 'center',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <View
          style={{
            // @ts-ignore
            pointerEvents: 'auto',
            position: 'absolute',
            top: -30,
            padding: 5,
          }}
          {...panResponder.panHandlers}
        >
          <VStack
            pointerEvents="auto"
            paddingHorizontal={20}
            paddingVertical={20}
            marginTop={-10}
          >
            <VStack
              backgroundColor="rgba(100,100,100,0.35)"
              width={60}
              height={8}
              borderRadius={100}
            />
          </VStack>
        </View>

        {content}
      </Animated.View>
    </VStack>
  )
})

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
})
