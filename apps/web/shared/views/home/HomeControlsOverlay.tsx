import { useState } from 'react'
import React, { memo } from 'react'
import { Text } from 'react-native'

import { AuthLoginRegisterView } from '../auth/AuthLoginRegisterView'
import { Icon } from '../shared/Icon'
import { LinkButton } from '../shared/Link'
import { Popover } from '../shared/Popover'
import { Spacer } from '../shared/Spacer'
import { Tooltip } from '../shared/Stack/Tooltip'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { flatButtonStyle } from './HomeViewTopDishes'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

export const HomeControlsOverlay = memo(() => {
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
          <VStack flex={1} />
          <HomeUserMenu />
        </HStack>

        <HStack position="absolute" bottom={0} right={0} left={0}>
          <Tooltip width="auto" alignItems="center" justifyContent="center">
            <HStack spacing>
              {[
                'Los Angeles',
                'Portland',
                'Seattle',
                'Las Vegas',
                'New York',
              ].map((city) => (
                <LinkButton
                  key={city}
                  {...flatButtonStyle}
                  name="search"
                  params={{ query: city }}
                >
                  <Text style={{ fontSize: 12 }}>{city}</Text>
                </LinkButton>
              ))}
            </HStack>
          </Tooltip>
          <VStack flex={1} />
          <HomeExploreMenu />
        </HStack>
      </VStack>
    </ZStack>
  )
})

const HomeUserMenu = memo(() => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <Popover
      position="bottom"
      isOpen={isOpen}
      contents={
        <Tooltip padding={20} width="30vw" minWidth={250}>
          <AuthLoginRegisterView setMenuOpen={setIsOpen} />
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
        <Icon name="user" size={16} opacity={0.5} />
      </LinkButton>
    </Popover>
  )
})

const HomeExploreMenu = memo(() => {
  const [isOpen, setIsOpen] = useState(true)
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
