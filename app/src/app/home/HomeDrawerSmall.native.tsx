import { AppMapHeader } from '../AppMapHeader'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { autocompletesStore } from '../AutocompletesStore'
import { drawerStore } from '../drawerStore'
import { StackDrawerControlsPortal } from '../views/StackDrawer'
import { DrawerFrame, DrawerFrameBg } from './HomeDrawerFrame'
import { Spacer, YStack, useThemeName } from '@dish/ui'
import { useReaction, useStoreInstance } from '@dish/use-store'
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { BlurView } from '@react-native-community/blur'
import {
  Blur,
  Canvas,
  Circle,
  Group,
  Mask,
  Rect,
  RoundedRect,
  Shadow,
} from '@shopify/react-native-skia'
import React, { useEffect, useState } from 'react'
import { Keyboard, MaskedViewIOS, StyleSheet, useWindowDimensions } from 'react-native'

let hasOpened = false

// @ts-ignore
const isRemoteDebugging = typeof DedicatedWorkerGlobalScope !== 'undefined'

export const HomeDrawerSmall = (props: any) => {
  const { visible: autocompleteVisible } = useStoreInstance(autocompletesStore)
  const [index, setIndex] = useState(1)
  const [bottomSheet, setBottomSheet] = useState<BottomSheetModal>()
  const dimensions = useWindowDimensions()

  useEffect(() => {
    if (autocompleteVisible) {
      setIndex(2)
    } else {
      Keyboard.dismiss()
      setIndex(1)
    }
  }, [autocompleteVisible])

  useReaction(
    drawerStore,
    (s) => s.snapIndex,
    (index) => {
      setIndex(index)
    }
  )

  useEffect(() => {
    const next = Math.max(0, index)
    drawerStore.setSnapIndex(next)
  }, [index])

  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  return (
    <>
      <YStack w="100%" h={70} top={20}>
        <AppMapHeader />
      </YStack>
      <BottomSheetModal
        ref={(sheet) => {
          if (!sheet) return
          if (bottomSheet) return
          setBottomSheet(sheet)

          if (!hasOpened) {
            hasOpened = true
            sheet.present()
          }
        }}
        handleComponent={() => null}
        backgroundComponent={() => null}
        snapPoints={drawerStore.snapPoints.map((p) => `${p * 100}%`)}
        index={index}
        onChange={setIndex}
        enableDismissOnClose={false}
        enablePanDownToClose={false}
      >
        <BlurView
          blurType={isDark ? 'dark' : 'xlight'}
          blurRadius={6}
          blurAmount={6}
          style={[StyleSheet.absoluteFill, { top: 40, borderRadius: 18, overflow: 'hidden' }]}
        />

        {!isRemoteDebugging && (
          <Canvas
            style={{
              flex: 1,
              zIndex: -1,
              transform: [{ translateY: -50 }],
              maxHeight: 200,
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              height: 200,
            }}
          >
            <Mask
              mode="alpha"
              mask={
                <Group>
                  <RoundedRect
                    width={dimensions.width}
                    height={80}
                    x={0}
                    y={10}
                    r={0}
                    color="#fff"
                  />
                </Group>
              }
            >
              <RoundedRect
                width={dimensions.width}
                height={500}
                x={0}
                y={80}
                r={20}
                color="rgba(0,0,0,0.37)"
              >
                <Blur blur={15} />
              </RoundedRect>
            </Mask>
          </Canvas>
        )}

        <YStack btrr="$8" btlr="$8" y={40} zi={100} f={1} pos="relative">
          <AppSearchBarInline />
          <YStack zi={1000} y={0}>
            <StackDrawerControlsPortal />
          </YStack>
          <BottomSheetScrollView
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
          >
            <DrawerFrame bc="transparent">
              <DrawerFrameBg />

              {props.children}
              <Spacer flex />
            </DrawerFrame>
          </BottomSheetScrollView>
        </YStack>
      </BottomSheetModal>
    </>
  )
}
