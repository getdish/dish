import { ExternalLink } from '@dish/react-feather'
import {
  Box,
  HStack,
  HoverablePopover,
  Modal,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import React from 'react'
import { useStorageState } from 'react-storage-hooks'

import { useOvermind } from '../state/om'
import { Link } from '../views/ui/Link'
import { LinkButton } from '../views/ui/LinkButton'
import { flatButtonStyle } from './home/baseButtonStyle'

export const WelcomeModal = () => {
  const om = useOvermind()
  const [show, setShow] = useStorageState(localStorage, 'welcome-modal2', true)

  return (
    <Modal maxWidth={380} isOpen={show} spacing="sm">
      <SmallTitle>Welcome to dish</SmallTitle>
      <VStack spacing={16}>
        <Text fontSize={18} lineHeight={25} paddingHorizontal={5} color="#000">
          The definitive best pho, tacos, wings, xiao long bao & what you crave
          with ultrafast search across all delivery services.
        </Text>

        {/* <Text
          fontSize={15}
            lineHeight={25}
            paddingHorizontal={5}
            color="#000"
        >
          <ul style={{ margin: 0 }}>
            <li>Search all delivery 🚗</li>
            <li>What's unique in each city 🌉</li>
            <li>
              A{' '}
              <Link
                inline
                name="pokedex"
                style={{ backgroundColor: 'rgba(255,255,0,0.2)' }}
              >
                pokedex
              </Link>{' '}
              for us all 📸
            </li>
          </ul>
        </Text> */}

        <Text fontSize={13} lineHeight={22} paddingHorizontal={5} color="#000">
          We're building a collaborative best-of list of food that combines the
          best of an online community and ratings-aggregator that{' '}
          <HoverablePopover
            overlay={false}
            position="left"
            contents={
              <Box minHeight={50}>
                <Text>Lorem ipsume dolor sit amet.</Text>
              </Box>
            }
          >
            <Link name="promise">doesn't sell us out</Link>
          </HoverablePopover>
          .
        </Text>

        {/* <SmallerTitle>Become a mod</SmallerTitle>
        <TextInput
          // @ts-ignore
          name="email"
          placeholder="name@email.com"
          style={textStyles.textField}
        /> */}

        <HStack>
          <LinkButton {...flatButtonStyle}>
            Tell me more <ExternalLink size={10} />
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
