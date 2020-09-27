import {
  Divider,
  HStack,
  Paragraph,
  SizableTextProps,
  SmallTitle,
  Spacer,
  Text,
  Title,
  UnorderedList,
  UnorderedListItem,
  VStack,
} from '@dish/ui'
import React from 'react'

import { StackItemProps } from '../../AppStackView'
import { brandColor, lightGreen, lightYellow } from '../../colors'
import { HomeStateItemAbout } from '../../state/home-types'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Logo } from '../../views/Logo'
import { StackDrawer } from '../../views/StackDrawer'
import { Link } from '../../views/ui/Link'
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
          paddingTop: 25,
          paddingHorizontal: '5%',
          flex: 1,
        }}
      >
        <VStack spacing="xxl">
          <HStack maxWidth="100%" alignItems="center">
            <Divider flex />
            <Spacer />
            <Logo scale={2} color={brandColor} />
            <Spacer />
            <Divider flex />
          </HStack>

          <VStack spacing="xl">
            <Paragraph size={1.5} fontWeight="600">
              Our goal: bring fun to exploring the real world.
            </Paragraph>

            <Paragraph
              fontStyle="italic"
              size="xxxl"
              fontWeight="300"
              color="rgba(0,0,0,0.7)"
            >
              An app for exploring the hidden gems of the world should feel like
              a quirky Pokedex that just gets you.
              <Text fontSize={22}>
                A&nbsp;"Hitchhikers&nbsp;guide to gastronomy", if you will.
              </Text>
            </Paragraph>

            <Paragraph size="xxl">
              Dish started from two frustrations:
            </Paragraph>

            <UnorderedList>
              <UnorderedListItem size="xl">
                Amazing hole-in-the-wall international cuisine lost to 3.5 star
                ratings.
              </UnorderedListItem>
              <UnorderedListItem size="xl">
                Needing one app to find what's good & three others to see if it
                delivers.
              </UnorderedListItem>
            </UnorderedList>

            <Paragraph size="xxl">
              We figured building an app to search across delivery was doable.
              But how do you fix the hole-in-the-wall ratings problem?
            </Paragraph>

            <Paragraph size="xxl">
              Our answer is that{' '}
              <TextStrong>5 star ratings may not be what we need</TextStrong>.
              They collapse everything you care about into one dimension. What
              you care about when ordering{' '}
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
              are <em>unique</em>: maybe it's a specific dish, or maybe it's
              just the delivery speed. Maybe it's the loudness, the speed, or
              maybe it's just if they have some decent vegetarian options.
            </Paragraph>

            <Paragraph size="xl">
              So, Dish throws away 5 stars altogether. Instead, when you write a
              review - we look at exactly what you say about each aspect, from
              the vibe or service, all the way down to individual, well, dishes.
            </Paragraph>

            <Paragraph size="xl">
              To source quality reviews, Dish crawls every top food review
              source, much like RottenTomatoes (except for fresh ones) -
              including crawling{' '}
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
              understands how you review.
            </Paragraph>
            <Paragraph size="lg">
              But more than that, we want to bring some fun and personality to
              how we explore. We let you collect and save local gems, see tips
              on where to go and what to order based on your mood, and explore
              chefs and other people who share your tastes maps of the world.
              Our goals are to:
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
              around you.
            </Paragraph>

            <Spacer />
            <Divider />

            <Paragraph>
              <Link href="mailto:team@dishapp.com">
                Let us know how you'd like to see us grow.
              </Link>
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
