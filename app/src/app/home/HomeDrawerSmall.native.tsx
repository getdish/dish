import { AppMapHeader } from '../AppMapHeader'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { autocompleteSearchStore, autocompletesStore } from '../AutocompletesStore'
import { useAutocompleteInputFocus } from '../hooks/useAutocompleteInputFocus'
import { SquareDebug } from '../views/SquareDebug'
import { DrawerFrame, DrawerFrameBg } from './HomeDrawerFrame'
import { Spacer, Square, YStack } from '@dish/ui'
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
  console.log('index', index)

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

  return (
    <>
      <YStack w="100%" h={70} top={20}>
        <AppMapHeader />
      </YStack>
      <BottomSheetModal
        ref={ref}
        handleComponent={() => null}
        backgroundComponent={() => null}
        snapPoints={['15%', '40%', '90%']}
        index={index}
        onChange={setIndex}
        enableDismissOnClose={false}
        enablePanDownToClose={false}
      >
        {/* <BottomSheetView
          style={{
            backgroundColor: 'rgba(0,0,0,0)',
            flex: 1,
            shadowColor: 'rgba(0,0,0,1)',
            shadowRadius: 20,
            shadowOffset: { width: 0, height: 0 },
          }}
        > */}
        <BottomSheetScrollView
        // style={{ flex: 1 }}
        >
          <YStack f={1} pos="relative" zi={100000000000}>
            <BlurView
              blurType="light"
              blurRadius={3}
              blurAmount={3}
              style={StyleSheet.absoluteFill}
            />
            <DrawerFrame>
              <DrawerFrameBg />

              <AppSearchBarInline />

              {props.children}
              <Spacer flex />
            </DrawerFrame>
          </YStack>
        </BottomSheetScrollView>
        {/* </BottomSheetView> */}
      </BottomSheetModal>
    </>
  )
}
