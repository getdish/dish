import { AbsoluteVStack, VStack } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import { debounce } from 'lodash'
import React, { useEffect, useMemo } from 'react'
import { Animated, PanResponder, View } from 'react-native'

import { drawerBorderRadius, pageWidthMax, searchBarHeight } from '../constants'
import { getWindowHeight } from '../helpers/getWindow'

// import { omStatic } from '../state/om'

export class BottomDrawerStore extends Store {
  snapPoints = [0.03, 0.25, 0.6]
  snapIndex = 1
  pan = new Animated.Value(this.getSnapPoint())
  spring: any

  get currentSnapPoint() {
    return this.snapPoints[this.snapIndex]
  }

  setSnapPoint(point: number) {
    this.updateSnapIndex(point)
    this.animateDrawerToPx()
  }

  animateDrawerToPx(px?: number) {
    this.spring = Animated.spring(this.pan, {
      useNativeDriver: true,
      toValue: this.getSnapPoint(typeof px === 'number' ? px : undefined),
    })
    this.spring.start(() => {
      this.spring = null
    })
  }

  getSnapPoint(px?: number) {
    if (typeof px === 'number') {
      // weird here
      this.checkUpdateSnapIndex(px)
    }
    return this.snapPoints[this.snapIndex] * getWindowHeight()
  }

  private setDrawer = debounce((val) => {
    // omStatic.actions.home.setDrawerSnapPoint(val)
  }, 100)

  private updateSnapIndex(x: number) {
    this.snapIndex = x
    this.setDrawer(x)
  }

  private checkUpdateSnapIndex(px: number) {
    for (const [index, point] of this.snapPoints.entries()) {
      const cur = point * getWindowHeight()
      const next = (this.snapPoints[index + 1] ?? 1) * getWindowHeight()
      const midWayToNext = cur + (next - cur) / 2
      if (px < midWayToNext) {
        this.updateSnapIndex(index)
        return
      }
    }
    this.updateSnapIndex(0)
  }
}

export const DrawerNative = (props: { children: any }) => {
  const drawerStore = useStore(BottomDrawerStore)
  const defaultSnapPoint = 1

  // useEffect(() => {
  //   // let lastIndex: number
  //   let lastAutocomplete = omStatic.state.home.showAutocomplete
  //   return omStatic.reaction(
  //     (state) => state.home.showAutocomplete,
  //     (show) => {
  //       if (!!show) {
  //         // lastIndex = snapIndex
  //         drawerStore.setSnapPoint(0)
  //       } else {
  //         if (lastAutocomplete === 'search') {
  //           drawerStore.setSnapPoint(defaultSnapPoint)
  //         }
  //       }
  //       lastAutocomplete = show
  //     }
  //   )
  // }, [])

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => {
        const threshold = 15
        return Math.abs(dy) > threshold
      },
      onPanResponderGrant: () => {
        drawerStore.spring?.stop()
        drawerStore.spring = null
        drawerStore.pan.setOffset(drawerStore.pan['_value'])
        // if (omStatic.state.home.showAutocomplete) {
        //   omStatic.actions.home.setShowAutocomplete(false)
        // }
      },
      onPanResponderMove: Animated.event([null, { dy: drawerStore.pan }]),
      onPanResponderRelease: () => {
        drawerStore.pan.flattenOffset()
        drawerStore.animateDrawerToPx(drawerStore.pan['_value'])
      },
    })
  }, [])

  return (
    <VStack>
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
            className="home-drawer-snap"
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

        <VStack
          width="100%"
          height="100%"
          shadowColor="rgba(0,0,0,0.13)"
          shadowRadius={44}
          shadowOffset={{ width: 10, height: 0 }}
          borderTopRightRadius={drawerBorderRadius}
          borderTopLeftRadius={drawerBorderRadius}
          pointerEvents="auto"
          backgroundColor="rgba(255,255,255,0.9)"
        >
          <View
            style={{
              zIndex: 100,
              position: 'relative',
              flexShrink: 1,
              minHeight: searchBarHeight,
            }}
            {...panResponder.panHandlers}
          >
            {/* <HomeSearchBarDrawer /> */}
          </View>

          <VStack flex={1} maxHeight="100%" position="relative">
            <AbsoluteVStack
              pointerEvents="none"
              fullscreen
              zIndex={1000000}
              {...(drawerStore.snapIndex > 0 && {
                pointerEvents: 'auto',
              })}
            >
              <View
                style={{ width: '100%', height: '100%' }}
                {...(drawerStore.snapIndex > 0 && panResponder.panHandlers)}
              />
            </AbsoluteVStack>

            {props.children}
          </VStack>
        </VStack>
      </Animated.View>
    </VStack>
  )
}
