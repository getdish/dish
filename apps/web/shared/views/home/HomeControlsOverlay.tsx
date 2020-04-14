import { useState } from 'react'
import React, { memo } from 'react'

import { HStack, VStack, ZStack } from '../ui/Stacks'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

export const HomeControlsOverlay = memo(() => {
  const [show, setShow] = useState(true)
  const drawerWidth = useHomeDrawerWidth()
  return (
    <ZStack
      fullscreen
      padding={20}
      pointerEvents="none"
      left={drawerWidth + 20}
      zIndex={10000000}
    >
      <VStack position="relative" flex={1}>
        <HStack position="absolute" top={0} right={0} left={0}>
          {/* top left */}
          <VStack flex={1} />
          {/* <HomeUserMenu /> */}
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
