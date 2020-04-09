import { Text, TextInput } from 'react-native'
import { useStorageState } from 'react-storage-hooks'

import { useOvermind } from '../state/om'
import { textStyles } from './auth/textStyles'
import { flatButtonStyle } from './home/baseButtonStyle'
import { Modal } from './Modal'
import { Box } from './shared/Box'
import { HoverablePopover } from './shared/HoverablePopover'
import { Icon } from './shared/Icon'
import { Link, LinkButton } from './shared/Link'
import { Popover } from './shared/Popover'
import { SmallTitle, SmallerTitle } from './shared/SmallTitle'
import { Spacer } from './shared/Spacer'
import { HStack, VStack } from './shared/Stacks'

export const WelcomeModal = () => {
  const om = useOvermind()
  const [show, setShow] = useStorageState(localStorage, 'welcome-modal2', true)

  return (
    <Modal maxWidth={380} isOpen={show} spacing="sm">
      <SmallTitle>Welcome to dish</SmallTitle>
      <VStack spacing={16}>
        {/* <Text
          style={{
            fontSize: 32,
            lineHeight: 40,
            paddingHorizontal: 5,
            color: '#000',
            fontWeight: '300',
            letterSpacing: -0.5,
          }}
        >
          A community for 🍽ies...
        </Text> */}
        <Text
          style={{
            fontSize: 15,
            lineHeight: 25,
            paddingHorizontal: 5,
            color: '#000',
          }}
        >
          We just want to find the best pho, tacos, wings, xiao long bao, you
          name it, easily, reliably, in every city.
        </Text>
        <Text
          style={{
            fontSize: 15,
            lineHeight: 25,
            paddingHorizontal: 5,
            color: '#000',
          }}
        >
          <ul style={{ margin: 0 }}>
            <li>Search all delivery 🚗</li>
            <li>What's unique in each city 🌉</li>
            <li>
              Your{' '}
              <Link
                inline
                name="pokedex"
                style={{ backgroundColor: 'rgba(255,255,0,0.2)' }}
              >
                pokedex
              </Link>{' '}
              for posterity 📸
            </li>
          </ul>
        </Text>

        <Text
          style={{
            fontSize: 15,
            lineHeight: 25,
            paddingHorizontal: 5,
            color: '#000',
          }}
        >
          We miss the community of FourSquare want
          <HoverablePopover
            overlay={false}
            position="left"
            contents={
              <Box minHeight={50}>
                <Text>Lorem ipsume dolor sit amet.</Text>
              </Box>
            }
          >
            <Link inline name="promise">
              opt-out by default, with a plan
            </Link>
          </HoverablePopover>
          .
        </Text>

        <SmallerTitle>early access, no spam:</SmallerTitle>
        <TextInput
          name="email"
          placeholder="name@email.com"
          style={textStyles.textField}
        />

        <HStack>
          <LinkButton {...flatButtonStyle}>
            Tell me more <Icon name="external-link" size={10} />
          </LinkButton>
          <Spacer flex />
          <LinkButton
            onPress={() => {
              setShow(false)
              om.actions.home.requestLocation()
            }}
            {...flatButtonStyle}
          >
            Ok!
          </LinkButton>
        </HStack>
      </VStack>
    </Modal>
  )
}
