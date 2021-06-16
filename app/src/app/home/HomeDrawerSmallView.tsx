import { useStoreInstance } from '@dish/use-store'
import React, { memo, useEffect, useMemo } from 'react'
import { Animated, PanResponder, StyleSheet, View } from 'react-native'
import { AbsoluteVStack, VStack, useMedia } from 'snackui'

import { pageWidthMax, searchBarHeight, zIndexDrawer } from '../../constants/constants'
import { isWebIOS } from '../../helpers/isIOS'
import { AppAutocompleteLocation } from '../AppAutocompleteLocation'
import { AppAutocompleteSearch } from '../AppAutocompleteSearch'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { blurSearchInput } from '../AppSearchInput'
import { autocompletesStore } from '../AutocompletesStore'
import { drawerStore as drawerStoreInstance } from '../drawerStore'
import { BottomSheetContainer } from '../views/BottomSheetContainer'

export const HomeDrawerSmallView = memo((props: { children: any }) => {
  const drawerStore = useStoreInstance(drawerStoreInstance)
  const media = useMedia()

  // attaching this as a direct onPress event breaks dragging
  // instead doing a more hacky useEffect
  useEffect(() => {
    const node = document.querySelector('.home-drawer-snap')
    if (node) {
      node.addEventListener('click', drawerStore.toggleDrawerPosition)
      return () => {
        node.removeEventListener('click', drawerStore.toggleDrawerPosition)
      }
    }
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
        // document.body.classList.add('all-input-blur')
        autocompletesStore.setVisible(false)
        blurSearchInput()
      },
      onPanResponderMove: Animated.event([null, { dy: drawerStore.pan }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        console.log('release')
        drawerStore.setIsDragging(false)
        drawerStore.pan.flattenOffset()
        drawerStore.animateDrawerToPx(drawerStore.pan['_value'])
        // document.body.classList.remove('all-input-blur')
      },
    })
  }, [])

  const children = useMemo(() => {
    return props.children
  }, [props.children])

  return (
    <VStack
      // pointerEvents={media.sm ? 'auto' : 'none'}
      opacity={media.sm ? 1 : 0}
      zIndex={media.sm ? zIndexDrawer : -1}
      width="100%"
      height="100%"
    >
      <Animated.View
        style={{
          transform: [
            {
              // this is the current Y as determined by the snap
              // drawerStore.snapIndex
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
        {/* handle */}
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
            <AppSearchBarInline />
          </View>

          <VStack flex={1} maxHeight="100%" position="relative">
            {/* overlay over entire content to make dragging it up easy */}
            {(isWebIOS || drawerStore.snapIndex === 2) && (
              <AbsoluteVStack pointerEvents="auto" fullscreen zIndex={1000000}>
                <View style={{ width: '100%', height: '100%' }} {...panResponder.panHandlers} />
              </AbsoluteVStack>
            )}

            <VStack position="relative" flex={1}>
              <AppAutocompleteLocation />
              <AppAutocompleteSearch />
              {children}
            </VStack>
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