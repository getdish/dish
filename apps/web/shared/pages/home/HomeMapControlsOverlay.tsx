import { AbsoluteVStack, HStack, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { ChevronUp, RefreshCcw } from 'react-feather'

import { searchBarHeight } from '../../constants'
import { useOvermind } from '../../state/useOvermind'
import { OverlayLinkButton } from '../../views/ui/OverlayLinkButton'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const HomeMapControlsOverlay = memo(
  ({ paddingLeft }: { paddingLeft: number }) => {
    const om = useOvermind()
    const hasMovedMap = om.state.home.currentState?.['hasMovedMap']
    const isSmall = useMediaQueryIsSmall()
    return (
      <AbsoluteVStack
        fullscreen
        padding={20}
        pointerEvents="none"
        top={searchBarHeight + 10}
        left={paddingLeft}
        maxWidth={600}
        right={0}
        {...(isSmall && {
          maxWidth: '100%',
          left: 0,
          right: 0,
          top: 0,
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
  }
)
