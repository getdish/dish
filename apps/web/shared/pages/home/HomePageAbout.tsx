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
              Craving pho but can't find the good stuff? Oftentimes Vietnamese,
              Chinese, and Mexican spots are lost behind poor ratings on
              ambiance and service.
            </Paragraph>

            <Paragraph size="xxl" fontWeight="300">
              We wanted to fix that. In doing so, we realized: when you're
              ordering{' '}
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
              </LinkButton>
              you simply care about different things - not just "how many stars"
              a place has. So, dish splits out the factors that matter, as well
              as ratings down to each dish. This has a nice effect - it means
              restaurants won't be forced to please everyone at everything, and
              instead they can focus on doing a few things really well.
            </Paragraph>

            <Paragraph size="xl">
              We're building dish as a food search engine that break things down
              by what matters. We crawl reviews from all over the web (like
              RottenTomatoes, for food), then parse{' '}
              <TextStrong>what people actually say</TextStrong> about all sorts
              of things - dishes, the vibe, service, and more - to build ratings
              on each factor, showing makes each place uniquely good.
            </Paragraph>

            <Paragraph size="xl">
              Dish also{' '}
              <Text borderBottomColor="#eee" borderBottomWidth={2}>
                searches every delivery service at once
              </Text>
              , because we found that when ordering delivery, it was especially
              nice to be able to find a specific dish you're craving without
              having to flip between many apps.
            </Paragraph>

            <Paragraph size="lg">
              Finally, we are really trying to make a review system and
              community that is more fun, interactive and organic. We think
              granular and reddit-style voting is one factor that helps, and
              another is letting people specialize in certain cuisines and
              locales. We'd like to build a community that helps power the
              algorithms that understand which factors matter, and how to
              describe a given restaurant. We'd love to build:
              <ul>
                <li>
                  <TextStrong>A better model for guides 🎙</TextStrong> - With
                  natural langauge models, threaded discussions, voting, and
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
              Our ultimate goal is to build a sort of community-powered
              Hitchhiker's Guide to Gastronomy (or, a Pokédex for poke): a fun,
              pocket map of the world that recognizes uniquely good places all
              over.
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
