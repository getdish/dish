import { AppMapHeader } from '../AppMapHeader'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { DrawerFrame, DrawerFrameBg } from './HomeDrawerFrame'
import { BlurView, Spacer, XStack, YStack } from '@dish/ui'
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet'
import React, { useState } from 'react'
import { FlatList, Pressable, ScrollView, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

// import { ScrollView } from 'react-native-gesture-handler'

export const HomeDrawerSmall = (props: any) => {
  // return (
  //   <FlatList
  //     data={[1, 2]}
  //     onStartShouldSetResponderCapture={() => false}
  //     onStartShouldSetResponder={() => false}
  //     onMoveShouldSetResponderCapture={() => false}
  //     onMoveShouldSetResponder={() => false}

  //     renderItem={({ item }) => {
  //       if (item === 1) {
  //         return (
  //           <Spacer
  //             pointerEvents="none"
  //             onTouchStart={() => {
  //               console.log(1234)
  //             }}
  //             // bc="red"
  //             pe="none"
  //             size={500}
  //           />
  //         )
  //       }
  //       return (
  //         <YStack pe="none" pos="relative" zi={100000000000}>
  //           {/* <AppMapHeader /> */}

  //           <YStack bc="red">
  //             <BlurView br="$4" ov="hidden" zi={-1} />
  //             <DrawerFrame>
  //               <DrawerFrameBg />

  //               <AppSearchBarInline />

  //               {props.children}
  //               <Spacer flex />
  //             </DrawerFrame>
  //           </YStack>
  //         </YStack>
  //       )
  //     }}
  //   />
  // )

  return (
    <>
      <AppMapHeader />
      <BottomSheet
        handleComponent={() => null}
        backgroundComponent={() => null}
        snapPoints={['10%', '50%', '90%']}
        index={0}
      >
        <BottomSheetView style={{ backgroundColor: 'rgba(0,0,0,0)', flex: 1 }}>
          <BottomSheetScrollView bounces={false} style={{ flex: 1 }}>
            <YStack f={1} pe="none" pos="relative" zi={100000000000}>
              <BlurView br="$4" ov="hidden" zi={-1} />
              <DrawerFrame>
                <DrawerFrameBg />

                <AppSearchBarInline />

                {props.children}
                <Spacer flex />
              </DrawerFrame>
            </YStack>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheet>
    </>
  )
}
