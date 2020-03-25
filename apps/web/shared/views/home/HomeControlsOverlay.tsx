import React, { memo } from 'react'
import { Spacer } from '../shared/Spacer'
import { VStack, ZStack, HStack } from '../shared/Stacks'
import { Image } from 'react-native'
import { LinkButton } from '../shared/Link'
import { HomeUserMenu } from './HomeUserMenu'
import { useHomeDrawerWidth } from './HomeView'

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
      <VStack flex={1}>
        <HStack>
          <VStack>
            <DishLogoButton />
          </VStack>

          <Spacer flex />

          <HStack pointerEvents="auto">
            <HomeUserMenu />
          </HStack>
        </HStack>
        <Spacer flex />
      </VStack>
    </ZStack>
  )
})

export const DishLogoButton = () => {
  return (
    <LinkButton
      name="home"
      paddingVertical={10}
      paddingHorizontal={11}
      backgroundColor="#fff"
      borderRadius={14}
      borderColor="#ccc"
      borderWidth={1}
      shadowColor="rgba(0,0,0,0.1)"
      shadowRadius={8}
      shadowOffset={{ width: 0, height: 2 }}
      // marginLeft={-50}
    >
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 1211 * 0.062, height: 605 * 0.062 }}
      />
    </LinkButton>
  )
}
