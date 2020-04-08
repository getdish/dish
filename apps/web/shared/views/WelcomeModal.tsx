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
            <li>Actually find the best Pho and Tacos!</li>
            <li>
              Let you review by <strong>dish</strong>.
            </li>
            <li>
              Search <em>fast</em> across every delivery service.
            </li>
            <li>Be a fun community with chefs, pop-ups, and exploration.</li>
          </ul>
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
