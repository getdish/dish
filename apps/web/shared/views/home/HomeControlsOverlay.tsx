import { useState } from 'react'
import React, { memo } from 'react'
import { Text } from 'react-native'

import { Icon } from '../shared/Icon'
import { LinkButton } from '../shared/Link'
import { Popover } from '../shared/Popover'
import { SmallTitle } from '../shared/SmallTitle'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { Box } from '../shared/Box'
import { flatButtonStyle } from './baseButtonStyle'
import { HomeUserMenu } from './HomeUserMenu'
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
