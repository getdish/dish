import { Text, TextInput } from 'react-native'
import { useStorageState } from 'react-storage-hooks'

import { textStyles } from './auth/textStyles'
import { flatButtonStyle } from './home/baseButtonStyle'
import { Modal } from './Modal'
import { LinkButton } from './shared/Link'
import { SmallTitle, SmallerTitle } from './shared/SmallTitle'
import { Spacer } from './shared/Spacer'
import { HStack, VStack } from './shared/Stacks'

export const WelcomeModal = () => {
  const [show, setShow] = useStorageState(localStorage, 'welcome-modal2', true)

  return (
    <Modal isOpen={show} spacing="sm">
      <SmallTitle>Welcome to Dish</SmallTitle>
      <VStack spacing={16}>
        <Text style={{ fontSize: 16, lineHeight: 28, padding: 5 }}>
          There needs to be a trustworthy community app for foodies that picks
          up where Foursquare left off and runs with it to the future. It
          should:
          <ul>
            <li>
              Separate rating <strong>food</strong> from{' '}
              <strong>service</strong>.
            </li>
            <li>Let you search across every delivery service.</li>
            <li>Provide reliable rankings, even for hole-in-the-walls!</li>
            <li>Defend a real community of chefs, foodies, and explorers.</li>
            <li>Focus on a high quality experience on all platforms.</li>
          </ul>
          Join us! We need help!
        </Text>

        <SmallerTitle>Join the dish community</SmallerTitle>
        <TextInput placeholder="name@email.com" style={textStyles.textField} />

        <HStack>
          <LinkButton {...flatButtonStyle}>How we break it down</LinkButton>
          <Spacer flex />
          <LinkButton onPress={() => setShow(false)} {...flatButtonStyle}>
            Ok!
          </LinkButton>
        </HStack>
      </VStack>
    </Modal>
  )
}
