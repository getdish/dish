import { AbsoluteVStack, HStack, Spacer, Text, VStack } from '@dish/ui'
import React, { memo, useState } from 'react'
import { ChevronUp, RefreshCcw, X } from 'react-feather'

import { pageWidthMax, searchBarHeight } from '../../constants'
import { useOvermind } from '../../state/useOvermind'
import { OverlayLinkButton } from '../../views/ui/OverlayLinkButton'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const HomeMapControlsOverlay = memo(() => {
  const om = useOvermind()
  const hasMovedMap = om.state.home.currentState?.['hasMovedMap']
  const drawerWidth = useHomeDrawerWidth()
  const isSmall = useMediaQueryIsSmall()
  const [isLoading, setIsLoading] = useState(false)
  return (
    <AbsoluteVStack
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
          Icon={RefreshCcw}
          className={`animate-up ${hasMovedMap ? 'active' : ''}`}
          pointerEvents="auto"
          alignItems="center"
          justifyContent="center"
          onPress={() => {
            om.actions.home.setHasMovedMap(false)
            om.actions.home.refresh()
          }}
        >
          Refresh
          <ChevronUp
            onMouseUp={(e) => {
              e.preventDefault()
              e.stopPropagation()
              om.actions.home.setHasMovedMap(false)
            }}
            size={12}
            color="#fff"
            style={{ margin: -6, marginLeft: 4, padding: 4, opacity: 0.4 }}
          />
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
    </AbsoluteVStack>
  )
})
