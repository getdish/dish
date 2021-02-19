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
              The Hitchiker's Guide to the Galaxy, starting with earth + food.
              We're&nbsp;exploring&nbsp;how to improve ratings and online
              communities.
            </Paragraph>

            <H3>How it started</H3>

            <Paragraph size="xl">
              Tacos and pho in the San Francisco Bay Area. In that corner of the
              galaxy, we'd noticed a disturbing trend: good food with poor
              ratings. Amazing Mexican, Chinese and Vietnamese spots with
              ⭐️⭐️⭐️/5 stars due to service or ambience. It was hard to know
              where to get a good bowl of pho.
            </Paragraph>

            <H3>The realization</H3>

            <Paragraph size="xxl">
              It's not that{' '}
              <Text fontStyle="italic">
                sometimes you don't want the trendy spot
              </Text>
              ... it's just{' '}
              <Text fontWeight="700">
                five star ratings don't really help you with that either
              </Text>
              . What we need is ratings down to the dish (and other factors that
              matter).
            </Paragraph>

            <Paragraph size="xl">
              By our estimate, it's time humans generally considered "five
              stars" a bad idea.
            </Paragraph>

            <Paragraph size="xl">
              Delivery adds more problems: up to four different services with
              unreliable ratings the "innovation" of virtual pop-ups (poor-rated
              restaurants masquerading under clean ratings).
            </Paragraph>

            <Paragraph size="xl">
              Getting a great bowl of poke delivered can feel like navigating
              Vogon beaurocracy.
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
              each dish, and splits out other factors by tags (vibe, service,
              vegan, etc).
            </Paragraph>

            <Paragraph size="xl">
              But of course it's not just ratings: building up a good community
              of hitchikers, accounting for taste, and a few more problems we
              want to solve:
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
