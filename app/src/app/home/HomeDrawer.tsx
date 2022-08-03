import { drawerWidthMax, pageWidthMax, zIndexDrawer } from '../../constants/constants'
import { AppMapControls } from '../AppMapControls'
import { AppSearchBarInline } from '../AppSearchBarInline'
import { DrawerPortalProvider } from '../Portal'
import { Spacer, XStack, YStack, styled, useMedia } from '@dish/ui'
import React from 'react'

export const HomeDrawer = (props: {
  showAutocomplete?: boolean | 'partial'
  children?: React.ReactNode
}) => {
  const media = useMedia()

  // small
  if (media.md) {
    return (
      <YStack pe="none" pos="relative" zi={100000000000}>
        <Spacer pe="none" size={400} />
        <DrawerFrame>
          <DrawerFrameBg />
          <AppSearchBarInline />
          {props.children}
        </DrawerFrame>
      </YStack>
    )
  }

  // large
  return (
    <>
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
            <DrawerPortalProvider />
          </DrawerFrame>
        </YStack>

        <YStack ov="hidden" pos="relative" f={1} h="100%" px="$4">
          <YStack pos="relative" f={1}>
            <AppMapControls />
          </YStack>
        </YStack>
      </XStack>
    </>
  )
}

const DrawerFrameBg = styled(YStack, {
  opacity: 0.2,
  zi: -1,
  fullscreen: true,
  br: '$6',
  backgroundColor: '$background',
})

const DrawerFrame = styled(YStack, {
  pos: 'relative',
  className: 'blur',
  bc: '$backgroundDrawer',
  br: '$6',
  pointerEvents: 'auto',
  maxWidth: drawerWidthMax,
  f: 1,
  zIndex: 10,
  flex: 1,
  shadowColor: 'rgba(0,0,0,0.135)',
  shadowRadius: 7,
  shadowOffset: {
    height: 4,
    width: 0,
  },
  bw: 1,
  boc: '$borderColor',
  justifyContent: 'flex-end',
})
