import React, { useEffect } from 'react'
import { Image } from 'react-native'
import {
  AbsoluteVStack,
  Divider,
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
import { drawerStore } from '../../drawerStore'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { LinkButton } from '../../views/LinkButton'
import { LogoColor } from '../../views/Logo'
import { StackDrawer } from '../../views/StackDrawer'
import { StackItemProps } from '../HomeStackView'

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
  useEffect(() => {
    if (!isActive) return undefined
    const tm = setTimeout(() => {
      if (drawerStore.snapIndex > 0) {
        drawerStore.setSnapIndex(0)
      }
    }, 350)
    return () => {
      clearTimeout(tm)
    }
  }, [isActive])

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
            <Spacer size="xl" />
            <LogoColor scale={2.5} />
            <Spacer size="lg" />
            <Paragraph
              zIndex={10}
              color="#999"
              textAlign="center"
              size={1.1}
              fontWeight="500"
            >
              your pocket guide to the world
            </Paragraph>
          </VStack>

          <VStack paddingHorizontal="5%" spacing="xl">
            <Paragraph size="xxl">
              We want to build a high quality, fun, collaborative guide to the
              real world that is entirely driven by users, and avoids the
              problems of corporatization and advertising pressure.
            </Paragraph>

            <Paragraph size="xl">
              It all started with food. In eating around the San Francisco Bay
              Area, we noticed a disturbing trend: too many great
              hole-in-the-wall restaurants were lost to poor ratings. Chinese
              and Vietnamese gems would sit at ⭐️⭐️⭐️ stars, while places
              with cute interiors but worse food get perfect scores.
            </Paragraph>

            <Paragraph size="xl">
              Meanwhile, delivery apps were consistently dissapointing in their
              scoring, not to mention all the fake, renamed pop-ups. Finding a
              decent delivered taco or bowl of poke was harder than just walking
              to an alright place nearby.
            </Paragraph>

            <Paragraph size="xl">
              We want to fix ratings and local search in general. What you want
              when looking for{' '}
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
              are <Text fontStyle="italic">unique</Text> and not captured by
              "five stars". One night you crave authentic food, and the next,
              ambience or drinks.{' '}
              <Text fontWeight="600">Dish rates what matters</Text> down to the,
              well, dish - and all the sub-factors that matter - and lets you
              explore based on your mood.
            </Paragraph>

            <Paragraph size="lg">
              Ultimately we're building what we want: a map of the world that
              lets us see what friends love, plan trips and nights out, find
              things that match our taste and mood, and do all this while not
              degrading in quality over time. We'll be writing more about how we
              plan to achieve this on <Link name="blog">the blog</Link>.
            </Paragraph>

            <Paragraph size="lg">
              Dish is just getting started. It works in a sketchy, fragile way.
              We poorly deliver what we aim to now (even the wording on this
              about page itself!), and we're working on that. But we think we
              have the right foundation and ideas, and we look forward to
              delivering something great soon.
            </Paragraph>

            <Paragraph size="lg">
              <Link display="inline" href="mailto:team@dishapp.com">
                Let us know what you'd love to see
              </Link>
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
