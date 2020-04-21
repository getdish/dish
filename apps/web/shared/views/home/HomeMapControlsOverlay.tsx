import { useState } from 'react'
import React, { memo } from 'react'
import { Text } from 'react-native'

import { searchBarHeight } from '../../constants'
import { useOvermind } from '../../state/om'
import { LinkButton, OverlayLinkButton } from '../ui/Link'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

export const HomeMapControlsOverlay = memo(() => {
  const om = useOvermind()
  const hasMovedMap = om.state.home.currentState?.['hasMovedMap']
  const drawerWidth = useHomeDrawerWidth()
  return (
    <ZStack
      fullscreen
      padding={20}
      pointerEvents="none"
      top={searchBarHeight + 10}
      left={drawerWidth + 20}
      zIndex={100}
    >
      <VStack position="relative" flex={1}>
        <HStack
          position="absolute"
          top={0}
          right={0}
          left={0}
          alignItems="center"
          justifyContent="center"
        >
          <OverlayLinkButton
            className={`animate-up ${hasMovedMap ? 'active' : ''}`}
            pointerEvents="auto"
            onPress={() => {
              om.actions.home.refresh()
            }}
          >
            <Text>Redo search in this area</Text>
          </OverlayLinkButton>
        </HStack>

        <HStack
          position="absolute"
          bottom={0}
          right={0}
          left={0}
          alignItems="flex-end"
        >
          <VStack flex={1} />
        </HStack>
      </VStack>
    </ZStack>
  )
})
