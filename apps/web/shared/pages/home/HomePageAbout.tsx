import { graphql } from '@dish/graph'
import {
  Button,
  Divider,
  HStack,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import React from 'react'

import { lightGreen, lightYellow } from '../../colors'
import { HomeStateItemAbout } from '../../state/home-types'
import { LinkButton } from '../../views/ui/LinkButton'
import { HomeScrollView } from './HomeScrollView'
import { HomeStackDrawer } from './HomeStackDrawer'
import { StackItemProps } from './HomeStackView'
import { Input } from './Input'
import { Paragraph } from './Paragraph'
import TextArea from './TextArea'
import { TextStrong } from './TextStrong'
import { Title } from './Title'

const inlineButton = {
  borderRadius: 10,
  paddingHorizontal: 3,
  position: 'relative',
} as const

export default function HomePageAbout({
  item,
}: StackItemProps<HomeStateItemAbout>) {
  return (
    <HomeStackDrawer closable title="About Dish">
      <HomeScrollView
        style={{
          paddingTop: 40,
          paddingHorizontal: '5%',
          paddingVertical: '5%',
          flex: 1,
        }}
      >
        <VStack spacing="xxl">
          <Title size="xl">The best 🍜, definitively</Title>

          <VStack spacing="xl">
            <Paragraph size="xxxl" fontWeight="300">
              Craving pho but can't find the good stuff? Vietnamese, Chinese,
              and Mexican joints often get lost behind poor ratings on ambiance
              and service.
            </Paragraph>

            <Paragraph size="xxl" fontWeight="300">
              We realized that when ordering{' '}
              <LinkButton
                fontWeight="400"
                backgroundColor={lightYellow}
                hoverStyle={{
                  backgroundColor: `${lightYellow}44`,
                }}
                {...inlineButton}
                tags={[
                  { name: 'Pho', type: 'dish' },
                  { name: 'delivery', type: 'filter' },
                ]}
              >
                delivery pho
              </LinkButton>{' '}
              or planning a{' '}
              <LinkButton
                fontWeight="400"
                tags={[
                  { name: 'Date', type: 'lense' },
                  { name: 'price-high', type: 'filter' },
                ]}
                {...inlineButton}
                backgroundColor={lightGreen}
                hoverStyle={{
                  backgroundColor: `${lightGreen}44`,
                }}
              >
                date night
              </LinkButton>
              , you care about completely different things. Yet todays rating
              systems give you{' '}
              <Text fontWeight="400">a single star rating</Text>.
            </Paragraph>

            <Paragraph size="xl">
              Dish breaks things down by what matters. First, it collects
              reviews from all over (like RottenTomatoes, for food), then it
              parses <TextStrong>what people actually say</TextStrong> about
              dishes, the vibe, service, and more, to show what makes each place
              uniquely good. It also{' '}
              <Text borderBottomColor="#eee" borderBottomWidth={2}>
                searches every delivery service at once
              </Text>
              , because when ordering delivery you often know exactly what
              you're craving.
            </Paragraph>

            <Paragraph size="lg">
              With reddit-style voting and sub-communities, we think we can grow
              a guide that gets better over time. Dish wants two things for the
              world:
              <ul>
                <li>
                  <TextStrong>A better model for guides 🎙</TextStrong>. One
                  knows how to allow ongoing organic discussion - and then takes
                  the sentiment and tips and reduces it into a "current best
                  of".
                </li>
                <li>
                  <TextStrong>To let restaurants specialize ✨</TextStrong>.
                  Instead of having to please everyone to try for 5 stars
                  overall, be rewarded for doing one or two exceptionally well.
                </li>
              </ul>
              We think of Dish as a Hitchhiker's Guide to Gastronomy (or, a
              Pokédex for poke, if you will): a fun, private pocket map of the
              world that a community can invest in.
            </Paragraph>

            <Spacer />

            <SmallTitle>TL;DR</SmallTitle>

            <Paragraph size="lg">
              <HStack marginVertical={4} alignItems="center">
                <Text marginHorizontal={10} fontSize={26}>
                  🗺
                </Text>{' '}
                Find uniquely good food with ratings down to the dish
              </HStack>
              <HStack marginVertical={4} alignItems="center">
                <Text marginHorizontal={10} fontSize={26}>
                  🚗
                </Text>{' '}
                Search across every delivery app at once
              </HStack>
              <HStack marginVertical={4} alignItems="center">
                <Text marginHorizontal={10} fontSize={26}>
                  ✨
                </Text>{' '}
                Community curation of what makes each area & restaurant special
              </HStack>
            </Paragraph>

            <Spacer />

            <Divider marginVertical={40} />

            <Paragraph>
              <a href="mailto:team@dishapp.com">
                Let us know how you'd like to see us grow.
              </a>
            </Paragraph>

            <Spacer size="sm" />

            {/* <form>
              <VStack>
                <Input name="email" type="email" placeholder="Email..." />
                <TextArea name="comment" numberOfLines={100} />
                <Button>Submit</Button>
              </VStack>
            </form> */}

            <Spacer />
            <Spacer />
            <Spacer />
            <Spacer />
          </VStack>
        </VStack>
      </HomeScrollView>
    </HomeStackDrawer>
  )
}
