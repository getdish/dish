import { AppMapHeader } from '../AppMapHeader'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { autocompletesStore } from '../AutocompletesStore'
import { drawerStore } from '../drawerStore'
import { StackDrawerControlsPortal } from '../views/StackDrawer'
import { AppFloatingTagMenuBar } from './AppFloatingTagMenuBar'
import { DrawerFrame, DrawerFrameBg } from './HomeDrawerFrame'
import { Spacer, Square, YStack, useThemeName } from '@dish/ui'
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
  Skia,
} from '@shopify/react-native-skia'
import React, { useEffect, useMemo, useState } from 'react'
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
  const drawerOffsetY = 50

  return (
    <>
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
        // handleComponent={() => {
        //   return <Square size={100} bc="red" />
        // }}
        // backdropComponent={() => {
        //   return <Square size={100} bc="red" />
        // }}
        backgroundComponent={() => null}
        snapPoints={drawerStore.snapPoints.map((p) => `${p * 100}%`)}
        index={index}
        onChange={setIndex}
        enableDismissOnClose={false}
        enablePanDownToClose={false}
      >
        <YStack pos="absolute" t={-10}>
          <AppFloatingTagMenuBar />
        </YStack>

        <BlurView
          blurType={isDark ? 'dark' : 'xlight'}
          blurRadius={6}
          blurAmount={6}
          style={[
            StyleSheet.absoluteFill,
            { top: drawerOffsetY, borderRadius: 18, overflow: 'hidden' },
          ]}
        />

        {/* custom shadow */}
        {!isRemoteDebugging && (
          <Canvas
            style={{
              flex: 1,
              zIndex: 100000000000000,
              transform: [{ translateY: -20 }],
              maxHeight: 200,
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              height: 200,
            }}
          >
            <Group
              invertClip
              clip={Skia.RRectXY(
                Skia.XYWHRect(0, 70, dimensions.width, dimensions.height),
                20,
                20
              )}
            >
              <RoundedRect
                width={dimensions.width}
                height={500}
                x={0}
                y={80}
                r={20}
                color="rgba(0,0,0,0.75)"
              >
                <Blur blur={15} />
              </RoundedRect>
            </Group>
          </Canvas>
        )}

        <YStack btrr="$8" btlr="$8" y={drawerOffsetY} zi={100} f={1} pos="relative">
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
