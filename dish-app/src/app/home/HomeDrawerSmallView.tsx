import { supportsTouchWeb } from '@dish/helpers'
import { useStoreInstance } from '@dish/use-store'
import React, { memo, useEffect, useMemo } from 'react'
import { Animated, PanResponder, StyleSheet, View } from 'react-native'
import { AbsoluteVStack, VStack, useMedia } from 'snackui'

import { autocompletesStore } from '../AppAutocomplete'
import { AppSearchBar } from '../AppSearchBar'
import { blurSearchInput } from '../AppSearchInput'
import { drawerStore as drawerStoreInstance } from '../DrawerStore'
import {
  pageWidthMax,
  searchBarHeight,
  zIndexDrawer,
} from '../../constants/constants'
import { isWebIOS } from '../../helpers/isIOS'
import { BottomSheetContainer } from '../views/BottomSheetContainer'
import { HomeDrawerSmallView as HomeDrawerSmallViewNative } from './HomeDrawerSmallView.native'

export const HomeDrawerSmallView = memo((props: { children: any }) => {
  if (supportsTouchWeb) {
    return <HomeDrawerSmallViewNative {...props} />
  }

  const drawerStore = useStoreInstance(drawerStoreInstance)
  const media = useMedia()

  // attaching this as a direct onPress event breaks dragging
  // instead doing a more hacky useEffect
  useEffect(() => {
    const drawerSnapListener = () => {
      if (drawerStore.snapIndex === 0) {
        autocompletesStore.setVisible(false)
        drawerStore.setSnapPoint(1)
      } else if (drawerStore.snapIndex === 1) {
        drawerStore.setSnapPoint(2)
      } else if (drawerStore.snapIndex === 2) {
        drawerStore.setSnapPoint(1)
      }
    }

    const node = document.querySelector('.home-drawer-snap')
    if (node) {
      node.addEventListener('click', drawerSnapListener)
      return () => {
        node.removeEventListener('click', drawerSnapListener)
      }
    }

    return undefined
  }, [])

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => {
        const threshold = 15
        return Math.abs(dy) > threshold
      },
      onPanResponderGrant: () => {
        drawerStore.setIsDragging(true)
        drawerStore.spring?.stop()
        drawerStore.spring = null
        drawerStore.pan.setOffset(drawerStore.pan['_value'])
        document.body.classList.add('all-input-blur')
        autocompletesStore.setVisible(false)
        blurSearchInput()
      },
      onPanResponderMove: Animated.event([null, { dy: drawerStore.pan }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        drawerStore.setIsDragging(false)
        drawerStore.pan.flattenOffset()
        drawerStore.animateDrawerToPx(drawerStore.pan['_value'])
        document.body.classList.remove('all-input-blur')
      },
    })
  }, [])

  return (
    <VStack
      className={media.sm ? '' : 'untouchable invisible'}
      zIndex={media.sm ? zIndexDrawer : -1}
      width="100%"
      height="100%"
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
          pointerEvents="auto"
          style={{
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

        <BottomSheetContainer>
          <View style={sheet.searchBarContainer} {...panResponder.panHandlers}>
            <AppSearchBar />
          </View>

          <VStack flex={1} maxHeight="100%" position="relative">
            {isWebIOS ||
              (drawerStore.snapIndex === 2 && (
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
              ))}

            {/* children */}

            {props.children}
          </VStack>
        </BottomSheetContainer>
      </Animated.View>
    </VStack>
  )
})

const sheet = StyleSheet.create({
  searchBarContainer: {
    zIndex: 100,
    position: 'relative',
    flexShrink: 1,
    width: '100%',
    minHeight: searchBarHeight,
  },
})
