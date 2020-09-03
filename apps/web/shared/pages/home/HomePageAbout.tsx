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
              Craving pho? Vietnamese, Chinese, and Mexican joints often get
              lost behind poor ratings on ambiance and service.
            </Paragraph>

            <Paragraph size="xxl" fontWeight="300">
              When ordering{' '}
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
              , you care about different things. Yet today you just get the same{' '}
              <Text fontWeight="400">list of ~4 star restuarants</Text> for
              either query.
            </Paragraph>

            <Paragraph size="xl">
              Dish collects reviews from all over - a bit like RottenTomatoes,
              for food - and breaks down{' '}
              <TextStrong>what people actually say</TextStrong> (about dishes,
              vibe, service, and more) to show you better results. It even{' '}
              <Text borderBottomColor="#eee" borderBottomWidth={2}>
                searches every delivery service at once
              </Text>
              .
            </Paragraph>

            <Paragraph size="lg">
              With reddit-style voting and sub-communities, we think we can
              build a nicer collaborative guide that grows over time. Dish wants
              to do two things:
              <ul>
                <li>
                  <TextStrong>A better model for guides 🎙</TextStrong>. One that
                  takes ongoing organic discussion and tips and reduces them
                  into a "current best of" guide.
                </li>
                <li>
                  <TextStrong>Let restaurants specialize ✨</TextStrong>.
                  Instead of having to please everyone to try for 5 stars
                  overall, be rewarded for doing one or two exceptionally well.
                </li>
              </ul>
              We think of it as a Hitchhiker's Guide to Gastronomy (or, a
              Pokédex for poke) - a fun pocket map of the world that people can
              feel confident investing in.
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
