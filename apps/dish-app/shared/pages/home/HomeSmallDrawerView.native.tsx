import { VStack } from '@dish/ui'
import { useStore } from '@dish/use-store'
import React, { useMemo } from 'react'
import { Animated, PanResponder, StyleSheet, View } from 'react-native'

import { pageWidthMax, searchBarHeight, zIndexDrawer } from '../../constants'
import { omStatic } from '../../state/omStatic'
import { BottomDrawerStore } from './BottomDrawerStore'
import { BottomSheetContainer } from './BottomSheetContainer'
import { HomeSearchBarDrawer } from './HomeSearchBar'
import { blurSearchInput } from './HomeSearchInput'

export const HomeSmallDrawerView = (props: { children: any }) => {
  const drawerStore = useStore(BottomDrawerStore)

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => {
        if (drawerStore.snapIndex === 0) {
          return dy > 15
        }
        const threshold = 15
        return Math.abs(dy) > threshold
      },
      onPanResponderGrant: () => {
        drawerStore.spring?.stop()
        drawerStore.spring = null
        drawerStore.pan.setOffset(drawerStore.pan['_value'])
        if (omStatic.state.home.showAutocomplete) {
          omStatic.actions.home.setShowAutocomplete(false)
        }
        blurSearchInput()
      },
      onPanResponderMove: Animated.event([null, { dy: drawerStore.pan }]),
      onPanResponderRelease: () => {
        drawerStore.pan.flattenOffset()
        drawerStore.animateDrawerToPx(drawerStore.pan['_value'])
      },
    })
  }, [])

  return (
    <VStack zIndex={zIndexDrawer} width="100%" height="100%">
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
            top: -40,
            padding: 15,
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
              backgroundColor="rgba(100,100,100,0.5)"
              width={60}
              height={8}
              borderRadius={100}
              hoverStyle={{
                backgroundColor: 'rgba(200,200,200,0.65)',
              }}
            />
          </VStack>
        </View>

        <BottomSheetContainer>
          <VStack flex={1} maxHeight="100%" position="relative">
            <View style={styles.container} {...panResponder.panHandlers}>
              <VStack maxHeight={searchBarHeight}>
                <HomeSearchBarDrawer />
              </VStack>
              <VStack flex={1}>{props.children}</VStack>
            </View>
          </VStack>
        </BottomSheetContainer>
      </Animated.View>
    </VStack>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
})
