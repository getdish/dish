import { useState } from 'react'
import React, { memo } from 'react'
import { Text } from 'react-native'

import { Icon } from '../shared/Icon'
import { LinkButton } from '../shared/Link'
import { Popover } from '../shared/Popover'
import { SmallTitle } from '../shared/SmallTitle'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { Tooltip } from '../shared/Tooltip'
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
          <HomeUserMenu />
        </HStack>

        <HStack
          position="absolute"
          bottom={0}
          right={0}
          left={0}
          alignItems="flex-end"
        >
          <VStack flex={1} />
          <Tooltip
            pointerEvents="auto"
            opacity={show ? 1 : 0}
            width="auto"
            justifyContent="center"
            maxWidth={250}
          >
            <SmallTitle>Welcome to Dish</SmallTitle>
            <VStack spacing={16}>
              <Text style={{ fontSize: 16, lineHeight: 24, padding: 5 }}>
                Reliable ratings down to the dish. Authentic international
                cuisine rankings. Fast search, across delivery service. Enjoy!
              </Text>

              <HStack>
                <LinkButton {...flatButtonStyle}>
                  How we break it down
                </LinkButton>
                <Spacer flex />
                <LinkButton onPress={() => setShow(false)} {...flatButtonStyle}>
                  Ok!
                </LinkButton>
              </HStack>
            </VStack>
          </Tooltip>

          {/* <HomeExploreMenu /> */}
        </HStack>
      </VStack>
    </ZStack>
  )
})

const HomeExploreMenu = memo(() => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover
      position="bottom"
      isOpen={isOpen}
      contents={
        <Tooltip padding={20} width="auto">
          <Text>something</Text>
        </Tooltip>
      }
    >
      <LinkButton
        backgroundColor="#fff"
        padding={15}
        width={15 * 2 + 16}
        height={15 * 2 + 16}
        borderRadius={100}
        shadowColor="rgba(0,0,0,0.2)"
        shadowRadius={10}
        shadowOffset={{ width: 0, height: 5 }}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Icon name="globe" size={16} opacity={0.5} />
      </LinkButton>
    </Popover>
  )
})
