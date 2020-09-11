import { Divider, HStack, SmallTitle, Spacer, Text, VStack } from '@dish/ui'
import React from 'react'

import { lightGreen, lightYellow } from '../../colors'
import { HomeStateItemAbout } from '../../state/home-types'
import { LinkButton } from '../../views/ui/LinkButton'
import { HomeScrollView } from './HomeScrollView'
import { HomeStackDrawer } from './HomeStackDrawer'
import { StackItemProps } from './HomeStackView'
import { Paragraph } from './Paragraph'
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
              Craving pho? Amazing Vietnamese, Chinese, and Mexican spots are
              often hard to find because a single 5-star rating forces food,
              ambiance and service all into one. Lets change the world of eating
              out (and in) by letting restaurants specialize.
            </Paragraph>

            <Paragraph size="xxl" fontWeight="300">
              When you're ordering{' '}
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
              vs planning a{' '}
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
              </LinkButton>{' '}
              what you care about is completely different. Dish understands that
              - we break ratings down by dish, ambiance, service, and much more.
            </Paragraph>

            <Paragraph size="xl">
              We're a bit like RottenTomatoes for food - we crawl every top food
              critic source, and then analyze at{' '}
              <TextStrong>what people actually say</TextStrong> to go beyond a
              single star rating. We then show you uniquely good cuisine in each
              area of the world. Dish also{' '}
              <Text borderBottomColor="#eee" borderBottomWidth={2}>
                searches across every delivery service
              </Text>{' '}
              so you don't have to flip between many apps to find the best fried
              chicken, or ceasar salad for delivery.
            </Paragraph>

            <Paragraph size="lg">
              We're want to bring back a fun curation community, letting people
              collect and curate local gems and tips on what to order. Our goals
              are to build:
              <ul>
                <li>
                  <TextStrong>A better model for guides 🎙</TextStrong> - With
                  natural langauge analysis, threaded discussions, voting, and
                  specialization, we want to prove that you "map-reduce" an
                  active community into a "current best of" guide.
                </li>
                <li>
                  <TextStrong>
                    A path for restaurants to specialize ✨
                  </TextStrong>
                  - Instead of having to please everyone to try for 5 stars
                  overall, restaurants should be rewarded for doing one or two
                  things exceptionally well.
                </li>
              </ul>
              The ultimate goal is to create a community-powered "Hitchhiker's
              Guide to Gastronomy" (or, a Pokédex for poke): a fun, pocket map
              of the world that you can curate, that really shows you uniquely
              good stuff.
            </Paragraph>

            <Spacer />

            <SmallTitle>TL;DR</SmallTitle>

            <Paragraph size="lg">
              <HStack marginVertical={4} alignItems="center">
                <Text marginHorizontal={10} fontSize={26}>
                  🗺
                </Text>{' '}
                Find uniquely good restaurants with ratings down to the dish
              </HStack>
              <HStack marginVertical={4} alignItems="center">
                <Text marginHorizontal={10} fontSize={26}>
                  🚗
                </Text>{' '}
                Search every delivery app at once
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
