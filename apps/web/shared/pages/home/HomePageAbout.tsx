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
              Craving pho? It sucks that amazing Vietnamese, Chinese, and
              Mexican spots with amazing food often get lost behind poor
              ratings. Lets stop smashing food, ambiance and service into one
              star rating.
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
              you care about different things, so Dish splits out ratings into
              every factor that matters - importantly, we go down to the dish.
              So you can find the best pho joint in town.
            </Paragraph>

            <Paragraph size="xl">
              We hope it changes the world of eating out and in by letting
              restaurants specialize. Instead of pleasing everyone they can
              focus on doing one or two things really well. Let hole in the wall
              gems thrive!
            </Paragraph>

            <Paragraph size="xl">
              To figure out accurate ratings we crawl every top critic source
              (think RottenTomatoes, for food) and then look at{' '}
              <TextStrong>
                what people actually say about all the factors that matter
              </TextStrong>{' '}
              - from the vibe, service, or individual dishes, to whether they
              have a good drinks, are vegetarian friendly, and more. Then, we
              build a map of food uniquely good to each area. Find uniquely good
              places, and exactly what you crave ✨.
            </Paragraph>

            <Paragraph size="xl">
              Dish{' '}
              <Text borderBottomColor="#eee" borderBottomWidth={2}>
                searches across every delivery service
              </Text>
              . It's nice to be able to find a dish you're craving without
              having to flip between many apps.
            </Paragraph>

            <Paragraph size="lg">
              Finally, we're building a curation community that is more fun,
              because you can debate the stats that matter and explore a map of
              gems more intuitively. We think reddit-style voting and
              specialization in cuisines and locales is key. Our goals are to
              build:
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
