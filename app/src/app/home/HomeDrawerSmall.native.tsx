import { AppMapHeader } from '../AppMapHeader'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { DrawerFrame, DrawerFrameBg } from './HomeDrawerFrame'
import HomePage from './HomePage'
import { Spacer, Square, YStack } from '@dish/ui'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'

export const HomeDrawerSmall = (props: any) => {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ minHeight: 2000 }}
      // pointerEvents="none"
    >
      <YStack f={1} pe="none" pos="relative" zi={100000000000}>
        <Spacer pe="none" size={400} />
        <AppMapHeader />
        <DrawerFrame>
          <DrawerFrameBg />

          <AppSearchBarInline />

          {props.children}
          <Spacer flex />
        </DrawerFrame>
      </YStack>
    </ScrollView>
  )
}
