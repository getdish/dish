import { pageWidthMax, searchBarHeight, zIndexDrawer } from '../../constants/constants'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { StackDrawerControlsPortal } from '../views/StackDrawer'
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
      pos="relative"
      h="100%"
      maxWidth={pageWidthMax}
      f={1}
      p="$2"
      pe="none"
      ai="flex-start"
      zi={zIndexDrawer}
    >
      <YStack f={1} w="100%" h="100%" maxWidth="60%">
        <DrawerFrame>
          <YStack pos="relative" t={searchBarHeight}>
            <StackDrawerControlsPortal />
          </YStack>
          <DrawerFrameBg />
          <AppSearchBarInline />
          {props.children}
        </DrawerFrame>
      </YStack>
    </XStack>
  )
}
