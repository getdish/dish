import { useState } from 'react'
import React, { memo } from 'react'
import { Text } from 'react-native'

import { pageWidthMax, searchBarHeight } from '../../constants'
import { useOvermind } from '../../state/useOvermind'
import { LinkButton, OverlayLinkButton } from '../ui/Link'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { useMediaQueryIsSmall } from './HomeViewDrawer'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

export const HomeMapControlsOverlay = memo(() => {
  const om = useOvermind()
  const hasMovedMap = om.state.home.currentState?.['hasMovedMap']
  const drawerWidth = useHomeDrawerWidth()
  const isSmall = useMediaQueryIsSmall()
  return (
    <ZStack
      fullscreen
      padding={20}
      pointerEvents="none"
      top={searchBarHeight + 10}
      left={drawerWidth + 20}
      maxWidth={pageWidthMax * 0.4}
      {...(isSmall && {
        maxWidth: '100%',
        left: 0,
        right: 0,
        top: searchBarHeight,
      })}
      zIndex={20}
      alignItems="center"
      justifyContent="center"
    >
      <HStack
        position="absolute"
        top={10}
        right={0}
        left={0}
        alignItems="center"
        justifyContent="center"
      >
        <OverlayLinkButton
          className={`animate-up ${hasMovedMap ? 'active' : ''}`}
          pointerEvents="auto"
          alignItems="center"
          justifyContent="center"
          onPress={() => {
            om.actions.home.refresh()
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '500' }}>
            Redo search in map area
          </Text>
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
    </ZStack>
  )
})
