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
import React, { useEffect, useState } from 'react'
import { Keyboard, StyleSheet } from 'react-native'

let hasOpened = false

export const HomeDrawerSmall = (props: any) => {
  const { visible: autocompleteVisible } = useStoreInstance(autocompletesStore)
  const [index, setIndex] = useState(1)
  const [bottomSheet, setBottomSheet] = useState<BottomSheetModal>()

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
          <YStack zi={1000} y={0}>
            <StackDrawerControlsPortal />
          </YStack>
          <BottomSheetScrollView>
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
