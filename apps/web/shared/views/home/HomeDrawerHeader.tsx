import React from 'react'
import { VStack, HStack } from '../shared/Stacks'
import { TouchableOpacity, Image } from 'react-native'
import { useOvermind } from '../../state/om'
import { LinkButton } from '../shared/Link'
import { SimpleLineIcons } from '@expo/vector-icons'
import { Spacer } from '../shared/Spacer'

export function HomeDrawerHeader() {
  const om = useOvermind()
  return (
    <VStack
      paddingVertical={12}
      paddingHorizontal={18}
      alignItems="center"
      justifyContent="center"
    >
      <HStack
        position="absolute"
        top={0}
        right={20}
        left={20}
        bottom={0}
        alignItems="center"
        zIndex={1000}
        pointerEvents="none"
        justifyContent="center"
      >
        <LinkButton
          onPress={() => om.actions.home.setShowMenu(!om.state.home.showMenu)}
        >
          <SimpleLineIcons name="menu" size={16} style={{ opacity: 0.5 }} />
        </LinkButton>

        <Spacer flex />
      </HStack>

      <HStack>
        <Spacer flex />

        <TouchableOpacity
          onPress={() => {
            om.actions.router.navigate({ name: 'home' })
          }}
        >
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 1211 * 0.065, height: 605 * 0.065 }}
          />
        </TouchableOpacity>

        <Spacer flex />
      </HStack>
    </VStack>
  )
}
