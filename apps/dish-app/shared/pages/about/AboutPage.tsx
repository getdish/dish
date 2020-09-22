import { Divider, HStack, SmallTitle, Spacer, Text, VStack } from '@dish/ui'
import React from 'react'

import { StackItemProps } from '../../AppStackView'
import { lightGreen, lightYellow } from '../../colors'
import { HomeStateItemAbout } from '../../state/home-types'
import { ContentScrollView } from '../../views/ContentScrollView'
import { StackDrawer } from '../../views/StackDrawer'
import { LinkButton } from '../../views/ui/LinkButton'
import { Paragraph } from '../../views/ui/Paragraph'
import { TextStrong } from '../../views/ui/TextStrong'
import { Title } from '../../views/ui/Title'

const inlineButton = {
  borderRadius: 10,
  paddingHorizontal: 3,
  position: 'relative',
} as const

export default function AboutPage({
  item,
}: StackItemProps<HomeStateItemAbout>) {
  return (
    <StackDrawer closable title="About Dish">
      <ContentScrollView
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
              Too often amazing Vietnamese, Chinese, and Mexican
              hole-in-the-wall spots are lost to bad ratings. We think todays
              star rating systems are failing us by forcing everything you care
              about into "5 stars".
            </Paragraph>

            <Paragraph size="xxl" fontWeight="300">
              What you care about when ordering{' '}
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
              versus when planning a{' '}
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
              are unique: maybe it's a specific dish, the delivery speed, the
              vibe, or if they have good vegetarian.
            </Paragraph>

            <Paragraph size="xxl" fontWeight="300">
              Dish ranks things down to the dish - and other factors that
              matter. When you write a review, we pull out your sentiment
              towards every dish and factor automatically! Like RottenTomatoes,
              Dish also crawls every top food critic - including{' '}
              <Text borderBottomColor="#eee" borderBottomWidth={2}>
                every delivery service
              </Text>{' '}
              - so you don't have to flip between many apps to find what you
              want, delivery or not.
            </Paragraph>

            <Paragraph size="lg">
              We think that by looking at{' '}
              <TextStrong>what people actually say</TextStrong> we can get
              better rankings, and also provide a more fun experience for
              reviewers. It should also let restaurants stop sweating pleasing
              everyone, and instead specialize.
            </Paragraph>

            <Paragraph size="lg">
              We want to build a fun community of people who curate what they
              love, letting you collect and save local gems, see tips on where
              to go and what to order based on your mood, and explore chefs and
              other people who share your tastes maps of the world. Our goals
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
      </ContentScrollView>
    </StackDrawer>
  )
}
