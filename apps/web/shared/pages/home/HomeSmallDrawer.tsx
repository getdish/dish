import { VStack } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import { debounce } from 'lodash'
import React, { useEffect, useMemo } from 'react'
import { Animated, PanResponder, View } from 'react-native'

import { pageWidthMax, searchBarHeight, zIndexDrawer } from '../../constants'
import { getWindowHeight } from '../../helpers/getWindow'
import { omStatic } from '../../state/om'
import { HomeSearchBarDrawer } from './HomeSearchBar'
import { blurSearchInput } from './HomeSearchInput'
import {
  useMediaQueryIsReallySmall,
  useMediaQueryIsShort,
  useMediaQueryIsSmall,
} from './useMediaQueryIs'

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

  private setDrawer = debounce(
    (val) => omStatic.actions.home.setDrawerSnapPoint(val),
    100
  )

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

export const HomeSmallDrawer = (props: { children: any }) => {
  const drawerStore = useStore(BottomDrawerStore)
  const isSmall = useMediaQueryIsSmall()
  const isReallySmall = useMediaQueryIsReallySmall()
  const isShort = useMediaQueryIsShort()
  const defaultSnapPoint = isShort && isReallySmall ? 0 : 1

  useEffect(() => {
    // let lastIndex: number
    return omStatic.reaction(
      (state) => !!state.home.showAutocomplete,
      (show) => {
        if (show) {
          // lastIndex = snapIndex
          drawerStore.setSnapPoint(0)
        } else {
          drawerStore.setSnapPoint(defaultSnapPoint)
        }
      }
    )
  }, [])

  // if starting out on a smaller screen, start with hiding map
  useEffect(() => {
    if (isShort && isSmall) {
      drawerStore.setSnapPoint(defaultSnapPoint)
    }
  }, [])

  // attaching this as a direct onPress event breaks dragging
  // instead doing a more hacky useEffect
  useEffect(() => {
    const drawerSnapListener = () => {
      if (drawerStore.snapIndex === 0) {
        omStatic.actions.home.setShowAutocomplete(false)
        drawerStore.setSnapPoint(1)
      } else if (drawerStore.snapIndex === 1) {
        drawerStore.setSnapPoint(2)
      } else if (drawerStore.snapIndex === 2) {
        drawerStore.setSnapPoint(1)
      }
    }

    const node = document.querySelector('.home-drawer-snap')

    node.addEventListener('click', drawerSnapListener)
    return () => {
      node.removeEventListener('click', drawerSnapListener)
    }
  }, [])

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
        document.body.classList.add('all-input-blur')
        if (omStatic.state.home.showAutocomplete) {
          omStatic.actions.home.setShowAutocomplete(false)
        }
        blurSearchInput()
      },
      onPanResponderMove: Animated.event([null, { dy: drawerStore.pan }]),
      onPanResponderRelease: () => {
        drawerStore.pan.flattenOffset()
        drawerStore.animateDrawerToPx(drawerStore.pan['_value'])
        document.body.classList.remove('all-input-blur')
      },
    })
  }, [])

  return (
    <VStack
      className={`${isSmall ? '' : 'untouchable invisible'}`}
      zIndex={isSmall ? zIndexDrawer : -1}
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
          backgroundColor="#fff"
          shadowColor="rgba(0,0,0,0.13)"
          shadowRadius={44}
          shadowOffset={{ width: 10, height: 0 }}
          borderTopRightRadius={10}
          borderTopLeftRadius={10}
          pointerEvents="auto"
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
            <HomeSearchBarDrawer />
          </View>
          <View
            style={{ height: '100%' }}
            {...(drawerStore.snapIndex > 0 && panResponder.panHandlers)}
          >
            {props.children}
          </View>
        </VStack>
      </Animated.View>
    </VStack>
  )
}
