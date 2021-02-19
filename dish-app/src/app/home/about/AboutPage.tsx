import React from 'react'
import { Image } from 'react-native'
import {
  AbsoluteVStack,
  Divider,
  H3,
  Paragraph,
  Spacer,
  Text,
  UnorderedList,
  UnorderedListItem,
  VStack,
} from 'snackui'

import dontPanic from '../../../assets/dont-panic.svg'
import { lightGreen, lightYellow } from '../../../constants/colors'
import { HomeStateItemAbout } from '../../../types/homeTypes'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { LinkButton } from '../../views/LinkButton'
import { LogoColor } from '../../views/Logo'
import { StackDrawer } from '../../views/StackDrawer'
import { StackItemProps } from '../HomeStackView'
import { useSnapToFullscreenOnMount } from '../restaurant/useSnapToFullscreenOnMount'

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
            <Spacer size="xl" />
            <Paragraph
              zIndex={10}
              color="#999"
              textAlign="center"
              size={1.1}
              fontWeight="300"
            >
              pocket guide to the world
            </Paragraph>
          </VStack>

          <VStack paddingHorizontal="5%" spacing="xl">
            <Paragraph
              paddingVertical={20}
              textAlign="center"
              size="lg"
              fontWeight="700"
            >
              We're building the Hitchiker's Guide to the Galaxy, starting with
              earth (and food). Ratings&nbsp;+&nbsp;online communities are
              breaking, we're exploring how to fix them.
            </Paragraph>

            <H3>How it started</H3>

            <Paragraph size="xl">
              Food — technically, a large bang and a lot of commotion, but
              ultimately — tacos and pho in the San Francisco Bay Area. In
              eating around that corner of the galaxy, we'd noticed a disturbing
              trend: international cuisine with poor ratings. Amazing Mexican,
              Chinese and Vietnamese spots with ⭐️⭐️⭐️/5 stars due to their
              hole-in-the-wall charms. It was hard to know where to get a good
              bowl of pho.
            </Paragraph>

            <H3>The problem</H3>

            <Paragraph size="xxl">
              It's not that{' '}
              <Text fontStyle="italic">
                sometimes you don't want the trendy spot
              </Text>
              ... it's just{' '}
              <Text fontWeight="700">
                five star ratings don't really help you with that either
              </Text>
              . By our estimate, it's time humans generally considered them bad
              idea.
            </Paragraph>

            <Paragraph size="xl">
              Delivery just makes it worse: more inconsistent scores, and new
              "innovations" like virtual pop-ups that are just poorly performing
              restaurants paying for a "rating reset". Getting a decent bowl of
              poke delivered easily is nearly as improbable as an improbability
              drive.
            </Paragraph>

            <H3>What we want</H3>

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
              are <Text fontStyle="italic">unique</Text>, so Dish rates down to
              each dish, and other factors that matter. We think the rating
              problem comes down to the factors that matter, unique to each type
              of cuisine or experience.
            </Paragraph>

            <Paragraph size="xl">
              But of course it's not just ratings, but also taste, and building
              up a good community of hitchikers. We hope we can solve it with a
              few things:
            </Paragraph>

            <UnorderedList>
              <UnorderedListItem size="xl">
                Single-account, invite-based membership
              </UnorderedListItem>
              <UnorderedListItem size="xl">
                Customizing to your taste, but letting you control the knobs
              </UnorderedListItem>
              <UnorderedListItem size="xl">
                Community voting across{' '}
                <Text fontStyle="italic">everything</Text>
              </UnorderedListItem>
              <UnorderedListItem size="xl">
                Sub-communities that can curate their own maps
              </UnorderedListItem>
              <UnorderedListItem size="xl">
                A paid-for "plus" membership that avoids ads
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
