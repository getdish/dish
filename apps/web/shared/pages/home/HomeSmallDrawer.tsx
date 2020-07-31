import { VStack } from '@dish/ui'
import { debounce } from 'lodash'
import React, { useEffect } from 'react'
import { Animated, PanResponder, View } from 'react-native'

import { pageWidthMax, zIndexDrawer } from '../../constants'
import { omStatic } from '../../state/useOvermind'
import { HomeSearchBarDrawer } from './HomeSearchBar'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const snapPoints = [0.02, 0.25, 0.6]
let snapIndex = 1

const setDrawer = debounce(omStatic.actions.home.setDrawerSnapPoint, 100)

const setSnapIndex = (x: number) => {
  snapIndex = x
  setDrawer(x)
}

const getSnapPoint = (px?: number) => {
  if (typeof px === 'number') {
    for (const [index, point] of snapPoints.entries()) {
      const cur = point * window.innerHeight
      const next = (snapPoints[index + 1] ?? 1) * window.innerHeight
      const midWayToNext = cur + (next - cur) / 2
      if (px < midWayToNext) {
        setSnapIndex(index)
        break
      }
    }
  }
  return snapPoints[snapIndex] * window.innerHeight
}

const animateDrawerToPx = (px?: number) => {
  spring = Animated.spring(pan, {
    useNativeDriver: true,
    toValue: getSnapPoint(typeof px === 'number' ? px : undefined),
  })
  spring.start(() => {
    spring = null
  })
}

const animateDrawerToSnapPoint = (point: number) => {
  snapIndex = point
  animateDrawerToPx()
}

const pan = new Animated.Value(getSnapPoint())
let spring: any

const panResponder = PanResponder.create({
  onMoveShouldSetPanResponder: (_, { dy }) => {
    const threshold = 15
    return Math.abs(dy) > threshold
  },
  onPanResponderGrant: () => {
    spring?.stop()
    spring = null
    pan.setOffset(pan['_value'])
    document.body.classList.add('all-input-blur')
  },
  onPanResponderMove: Animated.event([null, { dy: pan }]),
  onPanResponderRelease: (_, gesture) => {
    pan.flattenOffset()
    console.log('released at', gesture.dy, pan['_value'])
    animateDrawerToPx(pan['_value'])
    document.body.classList.remove('all-input-blur')
  },
})

export const HomeSmallDrawer = (props: { children: any }) => {
  const isSmall = useMediaQueryIsSmall()

  useEffect(() => {
    // let lastIndex: number
    return omStatic.reaction(
      (state) => !!state.home.showAutocomplete,
      (show) => {
        if (show) {
          // lastIndex = snapIndex
          animateDrawerToSnapPoint(0)
        } else {
          animateDrawerToSnapPoint(1)
        }
      }
    )
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
              translateY: pan,
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
            position: 'absolute',
            top: -30,
            padding: 15,
          }}
          {...panResponder.panHandlers}
        >
          <VStack
            pointerEvents="auto"
            paddingHorizontal={20}
            paddingVertical={10}
            marginTop={-10}
            onPress={() => {
              if (snapIndex === 0) {
                omStatic.actions.home.setShowAutocomplete(false)
                animateDrawerToSnapPoint(1)
              } else if (snapIndex === 1) {
                animateDrawerToSnapPoint(2)
              } else if (snapIndex === 2) {
                animateDrawerToSnapPoint(1)
              }
            }}
          >
            <VStack
              backgroundColor="rgba(100,100,100,0.5)"
              width={60}
              height={8}
              borderRadius={100}
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
        >
          <View {...panResponder.panHandlers}>
            <HomeSearchBarDrawer />
          </View>
          {props.children}
        </VStack>
      </Animated.View>
    </VStack>
  )
}
