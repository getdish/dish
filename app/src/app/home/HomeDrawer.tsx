import { pageWidthMax, zIndexDrawer } from '../../constants/constants'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { DrawerFrame, DrawerFrameBg } from './HomeDrawerFrame'
import { HomeDrawerSmall } from './HomeDrawerSmall'
import { XStack, YStack, useMedia } from '@dish/ui'
import React from 'react'

export const HomeDrawer = (props: {
  showAutocomplete?: boolean | 'partial'
  children?: React.ReactNode
}) => {
  const media = useMedia()

  // small
  if (media.md) {
    return <HomeDrawerSmall {...props} />
  }

  // large
  return (
    <XStack
      // fullscreen
      pos="relative"
      margin="auto"
      maxWidth={pageWidthMax}
      f={1}
      p="$2"
      pe="none"
      ai="flex-start"
      zi={zIndexDrawer}
    >
      <YStack f={1} w="100%" maxWidth="60%">
        <DrawerFrame>
          <DrawerFrameBg />
          <AppSearchBarInline />
          {props.children}
        </DrawerFrame>
      </YStack>
    </XStack>
  )
}
