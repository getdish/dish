import React from 'react'
import { Image } from 'react-native'
import {
  AbsoluteVStack,
  Divider,
  H3,
  HStack,
  Paragraph,
  Spacer,
  Text,
  UnorderedList,
  UnorderedListItem,
  VStack,
} from 'snackui'

import dontPanic from '../../../assets/dont-panic.svg'
import {
  green,
  lightGreen,
  lightYellow,
  orange,
  purple,
  red,
} from '../../../constants/colors'
import { HomeStateItemAbout } from '../../../types/homeTypes'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { LinkButton } from '../../views/LinkButton'
import { LogoColor } from '../../views/Logo'
import { StackDrawer } from '../../views/StackDrawer'
import { StackItemProps } from '../HomeStackView'
import { RatingView } from '../RatingView'
import { useSnapToFullscreenOnMount } from '../restaurant/useSnapToFullscreenOnMount'
import { RestaurantRatingView } from '../RestaurantRatingView'

const inlineButton = {
  borderRadius: 10,
  paddingHorizontal: 10,
  paddingVertical: 2,
  position: 'relative',
  display: 'inline-flex',
} as const

export default function AboutPage({
  item,
  isActive,
}: StackItemProps<HomeStateItemAbout>) {
  useSnapToFullscreenOnMount()

  return (
    <StackDrawer closable title="About Dish">
      <ContentScrollView id="about">
        <VStack spacing="xl">
          <VStack
            marginLeft={-60}
            marginRight={20}
            paddingLeft={60}
            borderRadius={60}
            maxWidth="100%"
            alignItems="center"
            position="relative"
          >
            <Spacer size="xxl" />
            <LogoColor scale={2.5} />
            {/* <Spacer size="xl" />
            <Paragraph
              zIndex={10}
              color="#999"
              textAlign="center"
              size={1.1}
              fontWeight="300"
            >
              pocket guide to the world
            </Paragraph> */}
          </VStack>

          <VStack paddingHorizontal="5%" spacing="xl">
            <Paragraph
              paddingVertical={20}
              textAlign="center"
              size="lg"
              fontWeight="700"
            >
              A Hitchiker's Guide to Gastronomy.
              <br /> We're&nbsp;exploring&nbsp;how to improve ratings and online
              communities.
            </Paragraph>

            <Paragraph size="xxl">
              We've noticed disturbing trends. Amazing Latin and Asian
              restaurants with ⭐️⭐️⭐️ stars. Delivery apps promoting fake
              pop-ups of poor performing restaurants. Unopinionated rankings
              designed to sell, and content quality dropping with every drip of
              SEO.
            </Paragraph>

            <Paragraph size="xl">
              These days finding an actually great
              <LinkButton
                backgroundColor={lightYellow}
                hoverStyle={{
                  backgroundColor: `${lightYellow}44`,
                }}
                {...inlineButton}
                tags={[
                  {
                    name: 'Banh Xeo',
                    slug: 'vietnamese__banh-xeo',
                    type: 'dish',
                  },
                ]}
              >
                banh xeo
              </LinkButton>
              or{' '}
              <LinkButton
                tags={[
                  {
                    name: 'Birria Taco',
                    slug: 'mexican__birria-taco',
                    type: 'dish',
                  },
                ]}
                {...inlineButton}
                backgroundColor={lightGreen}
                hoverStyle={{
                  backgroundColor: `${lightGreen}44`,
                }}
              >
                birria taco
              </LinkButton>{' '}
              requires Google-fu, 30 minutes, and a lack of appetite. We'd like
              to create a high quality guide to the world powered by community
              with a small, passionate team that doesn't cave to the pressures
              of advertising and hyper-growth.
            </Paragraph>

            <Paragraph size="lg">
              How?{' '}
              <Link
                fontWeight="800"
                name="blog"
                params={{ slug: 'welcome-to-dish' }}
              >
                We have some ideas
              </Link>
              .
            </Paragraph>

            <Paragraph size="xl">
              What you want when looking for{' '}
              <LinkButton
                backgroundColor={lightYellow}
                hoverStyle={{
                  backgroundColor: `${lightYellow}44`,
                }}
                {...inlineButton}
                tags={[
                  { name: 'Pho', type: 'dish' },
                  { name: 'price-low', type: 'filter' },
                ]}
              >
                cheap pho 🍜
              </LinkButton>{' '}
              vs planning a{' '}
              <LinkButton
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
              are <Text fontStyle="italic">unique</Text>, so instead of five
              stars, Dish rates <em>everything</em>: each dish, service,
              ambience, whether it's vegetarian-friendly, has a nice patio, or
              is a good place for drinks.
            </Paragraph>

            <UnorderedList>
              <UnorderedListItem size="lg">
                Taste profile, but let you control the algorithm
              </UnorderedListItem>
              <UnorderedListItem size="lg">
                Voting across <Text fontStyle="italic">everything</Text>
              </UnorderedListItem>
              <UnorderedListItem size="lg">
                Single-account, invite-based membership
              </UnorderedListItem>
              <UnorderedListItem size="lg">
                Sub-communities / specialization
              </UnorderedListItem>
              <UnorderedListItem size="lg">
                A non-ad, non-tracked private option
              </UnorderedListItem>
            </UnorderedList>

            <Paragraph size="lg">
              Ultimately we're building what we want: a map of the world that
              lets us see what friends love, plan trips and nights out, find
              things that match our taste and mood, and do all this while not
              degrading in quality over time. We'll be writing more about how we
              plan to achieve this on <Link name="blog">the blog</Link>.
            </Paragraph>

            <Paragraph size="lg">
              Dish is just getting started. It works in a sketchy, fragile way,
              and not everything is all lined up (including the words on this
              very page). But we think we have the right foundation and ideas,
              and we look forward to delivering something great soon.
            </Paragraph>

            <Paragraph size="lg">
              <Link display="inline" href="mailto:team@dishapp.com">
                Let us know what you'd love to see
              </Link>
              .
            </Paragraph>

            <Paragraph size="lg">Cheers! 🌮🍜</Paragraph>

            <Spacer />
            <Divider />

            <Paragraph size="xl">
              <AbsoluteVStack
                zIndex={1}
                bottom={0}
                right={15}
                width={125}
                height={125}
                transform={[{ rotate: '12deg' }]}
              >
                <Image
                  style={{ width: '100%', height: '100%' }}
                  source={{ uri: dontPanic }}
                  resizeMode="contain"
                />
              </AbsoluteVStack>
            </Paragraph>
            <Spacer />
          </VStack>
        </VStack>
      </ContentScrollView>
    </StackDrawer>
  )
}
