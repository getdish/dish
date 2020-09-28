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
import {
  brandColor,
  brandColorDark,
  lightGreen,
  lightYellow,
} from '../../colors'
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
            <Paragraph textAlign="center" size={1.5} fontWeight="600">
              Bring fun to exploring the real world.
            </Paragraph>

            <Paragraph
              fontStyle="italic"
              size="xxxl"
              fontWeight="300"
              color={brandColorDark}
            >
              A modern guide to the food gems of the world should feel like a{' '}
              <Text display="inline" fontWeight="600">
                fun Pokédex
              </Text>{' '}
              that really gets you.
            </Paragraph>

            <Paragraph size="xl">
              We're building a modern "Hitchhikers guide to gastronomy", if you
              will. A collaborative guide that makes it fun to find great food
              around the world. Dish was born from two frustrations:
            </Paragraph>

            <UnorderedList spacing>
              <UnorderedListItem size="xl">
                Amazing hole-in-the-wall international spots lost to 3.5 star
                ratings.
              </UnorderedListItem>
              <UnorderedListItem size="xl">
                Needing one app to <em>find</em> what's good & three others to
                see if it delivers.
              </UnorderedListItem>
            </UnorderedList>

            <Paragraph size="xl">
              Search across delivery was doable. But how do you fix
              hole-in-the-wall ratings?
            </Paragraph>

            <Paragraph size="xl">
              Our answer:{' '}
              <TextStrong display="inline">
                5 star ratings is not what we need
              </TextStrong>
              . It collapses everything you care about into one dimension. What
              you want when ordering{' '}
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
              versus planning a{' '}
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
              are <em>unique</em>: whether it's a specific dish, delivery speed,
              vibe, ambiance - it totally depends on your current desire.
            </Paragraph>

            <Paragraph size="xl">
              So, we're taking a chance and throwing away 5 stars altogether.
              Instead, Dish sorts it's results by points. Points are based on
              all the factors you're searching for, so when you search "quick
              cheap pizza", we take opinions across all reviews as votes for
              quick, cheap, and pizza, and sum them up.
            </Paragraph>

            <Paragraph size="xl">
              Then you can upvote and downvote on every factor. In fact, when
              you write a review, we take yout text and turn it into votes (that
              you can confirm or change before submitting). By letting people
              speak their minds naturally and then counting{' '}
              <TextStrong display="inline">what they say into votes</TextStrong>
              , we think we can build a more inuitive guide.
            </Paragraph>

            <Paragraph size="xl">
              Dish sources reviews from many of the top food review sites. Much
              like RottenTomatoes does for movies, we do for food. We also crawl{' '}
              <Text
                lineHeight={24}
                borderBottomColor="#eee"
                borderBottomWidth={2}
                display="inline"
              >
                every delivery service
              </Text>{' '}
              - so finally, you don't need to flip between apps to find what you
              want.
            </Paragraph>

            <Paragraph size="lg">
              But more than just putting together cool technology, we want to
              build something fun and personal. A private guide that caters to
              you, where you can collect and curate local gems, explore with
              friends or see chef picks, get tips on where to go and what to
              order, and filter by mood and desire. Our goals are to:
            </Paragraph>

            <UnorderedList spacing>
              <UnorderedListItem size="lg">
                <TextStrong display="inline">Make a better guide 🎙</TextStrong>{' '}
                - With natural langauge analysis, threaded discussions, voting,
                and specialization, we want to prove that you "map-reduce" an
                active community into a "current best of" guide.
              </UnorderedListItem>
              <UnorderedListItem size="lg">
                <TextStrong display="inline">
                  Enable unique, high quality restaurants ✨
                </TextStrong>
                - Instead of having to please everyone to try for 5 stars
                overall, restaurants should be rewarded for doing one or two
                things exceptionally well.
              </UnorderedListItem>
            </UnorderedList>

            <Paragraph size="lg">
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
