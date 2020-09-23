import {
  Divider,
  HStack,
  Paragraph,
  SmallTitle,
  Spacer,
  Text,
  Title,
  VStack,
} from '@dish/ui'
import React from 'react'

import { StackItemProps } from '../../AppStackView'
import { lightGreen, lightYellow } from '../../colors'
import { HomeStateItemAbout } from '../../state/home-types'
import { ContentScrollView } from '../../views/ContentScrollView'
import { StackDrawer } from '../../views/StackDrawer'
import { LinkButton } from '../../views/ui/LinkButton'
import { TextStrong } from '../../views/ui/TextStrong'

const inlineButton = {
  borderRadius: 10,
  paddingHorizontal: 6,
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
              hole-in-the-wall spots are lost to bad ratings, despite making
              some of the best food. Todays rating systems fail us by forcing
              everything you care about into "5&nbsp;stars".
            </Paragraph>

            <Paragraph size="xxl" fontWeight="300">
              We think we can fix that. What you care about when ordering{' '}
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
                delivery pho 🍜
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
                date night 🌃
              </LinkButton>{' '}
              are <em>unique</em>: whether it's a specific dish or the delivery
              speed, the vibe, vegetarian options, or if they have a patio.
            </Paragraph>

            <Paragraph size="xxl" fontWeight="300">
              <Text display="inline" fontWeight="600">
                Dish rates down to the dish - and all the factors that matter
              </Text>
              . When you write a review, we pull out your sentiment towards
              every possible tag automatically. Much like RottenTomatoes, Dish
              also crawls every top food review source - including{' '}
              <Text
                lineHeight={24}
                borderBottomColor="#eee"
                borderBottomWidth={2}
              >
                every delivery app
              </Text>{' '}
              - so finally, you don't need to flip between apps to find what you
              want.
            </Paragraph>

            <Paragraph size="lg">
              By looking at <TextStrong>what people actually say</TextStrong> we
              think we can build a better guide to the world, on that
              understands how you review. It should also be nicer for
              restaurants: instead of having to please every type of person to
              try and always keep 5 stars, they can instead specialize on what
              they want to be good good at.
            </Paragraph>

            <Paragraph size="lg">
              We want to build a fun community of people who curate what they
              love to build a beautiful map of the world - what makes each place
              unique. We let you collect and save local gems, see tips on where
              to go and what to order based on your mood, and explore chefs and
              other people who share your tastes maps of the world. Our goals
              are to:
              <ul>
                <li>
                  <TextStrong>Make a better guide 🎙</TextStrong> - With natural
                  langauge analysis, threaded discussions, voting, and
                  specialization, we want to prove that you "map-reduce" an
                  active community into a "current best of" guide.
                </li>
                <li>
                  <TextStrong>
                    Enable unique, high quality restaurants ✨
                  </TextStrong>
                  - Instead of having to please everyone to try for 5 stars
                  overall, restaurants should be rewarded for doing one or two
                  things exceptionally well.
                </li>
              </ul>
              The ultimate goal is to create a community-powered "Hitchhiker's
              Guide to Gastronomy", or, a Pokédex for poke: a guide that feels
              alive and personalized, that really understands you and the world
              around you (while keeping your information private).
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
