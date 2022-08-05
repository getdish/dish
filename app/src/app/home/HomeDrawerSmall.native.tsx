import { AppMapHeader } from '../AppMapHeader'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { autocompleteSearchStore, autocompletesStore } from '../AutocompletesStore'
import { useAutocompleteInputFocus } from '../hooks/useAutocompleteInputFocus'
import { SquareDebug } from '../views/SquareDebug'
import { DrawerFrame, DrawerFrameBg } from './HomeDrawerFrame'
import { Spacer, Square, YStack, useThemeName } from '@dish/ui'
import { useStoreInstance } from '@dish/use-store'
import BottomSheet, {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { BlurView } from '@react-native-community/blur'
import React, { useEffect, useRef, useState } from 'react'
import { Keyboard, StyleSheet } from 'react-native'

// broken..

// https://github.com/gorhom/react-native-bottom-sheet/issues/1008

let hasOpened = false

export const HomeDrawerSmall = (props: any) => {
  const { visible: autocompleteVisible } = useStoreInstance(autocompletesStore)
  const [index, setIndex] = useState(1)

  useEffect(() => {
    if (autocompleteVisible) {
      setIndex(2)
    } else {
      Keyboard.dismiss()
      setIndex(1)
    }
  }, [autocompleteVisible])

  const ref = useRef<BottomSheetModal>()
  useEffect(() => {
    if (hasOpened) return
    hasOpened = true
    console.log('present')
    ref.current?.present()
  }, [])

  useEffect(() => {
    ref.current?.snapToIndex(Math.max(0, index))
  }, [index])

  const themeName = useThemeName()
  const isDark = themeName === 'dark'

  return (
    <>
      <YStack w="100%" h={70} top={20}>
        <AppMapHeader />
      </YStack>
      <BottomSheetModal
        ref={ref as any}
        handleComponent={() => null}
        backgroundComponent={() => null}
        snapPoints={['18%', '50%', '95%']}
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
        <YStack
          btrr="$8"
          btlr="$8"
          y={40}
          shac="#000"
          shar={20}
          shop={0.4}
          f={1}
          pos="relative"
        >
          <AppSearchBarInline />
          <BottomSheetScrollView
          // style={{ flex: 1 }}
          // bounces={false}
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
