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
              A high quality, fun, community-built guide to the real world - a
              Hitchiker's Guide to the Galaxy, for earth, starting with food.
            </Paragraph>

            <Paragraph size="xl">
              It all started with food. In eating around the San Francisco Bay
              Area, we noticed a disturbing trend: too many great
              hole-in-the-wall restaurants were lost to poor ratings. Amazing
              Mexican, Chinese and Vietnamese gems would sit at ⭐️⭐️⭐️.5
              stars due to their hole-in-the-wall charms, while more
              Instagrammable places with bland food would score near-perfectly.
            </Paragraph>

            <Paragraph size="xxl">
              It's not that{' '}
              <Text fontStyle="italic">
                sometimes you don't want a trendy spot with ok food
              </Text>
              - it's just{' '}
              <Text fontWeight="800">
                five star ratings don't really help you with that either
              </Text>
              . It's time humans start to generally consider them a bad idea, by
              our estimation.
            </Paragraph>

            <Paragraph size="xl">
              Meanwhile, delivery apps have consistently inconsistent ratings,
              alongside a new "innovation" in virtual pop-ups of existing
              rebranded, poorly-performing restaurants. Combine that with the
              whole 5-star issue and finding a decent delivered taco or bowl of
              poke is often more painful than Vogon poetry.
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
              are <Text fontStyle="italic">unique</Text>, so Dish rates down to
              each dish, and other factors that matter. We think we can fix
              ratings with a community that tags and rates tags across
              everything, and shares lists of their favorite spots, nights out,
              and dishes. We use your votes, a mini-search engine that crawls
              for outside reviews, and a dash of NLP to show what each place
              excels or dissapoints at more exactly.
            </Paragraph>

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
