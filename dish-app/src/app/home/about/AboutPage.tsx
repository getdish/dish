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
              find amazing things
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
              and Vietnamese gems would sit at ⭐️⭐️⭐️ stars, while more
              Americanized with worse food would get nearly 5. One part of the
              problem was at more authentic foreign restaurants people just
              didn't know what their specialty was, how to order it, or what to
              expect.
            </Paragraph>

            <Paragraph size="xl">
              Meanwhile, delivery apps have even worse scoring (not fake,
              renamed pop-ups of poor-performing restaurants), finding a decent
              plate you were craving became a chorse. And so Dish was born.
            </Paragraph>

            <Paragraph size="xl">
              What you look for when ordering{' '}
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
              versus planning a{' '}
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
                date 🌃
              </LinkButton>{' '}
              are <Text fontStyle="italic">fundamentally different</Text> - one
              night you crave an authentic dish, the others you just want some
              nice ambiance and drinks.
              <Text fontWeight="600">
                Dish moves past 5-stars and instead rates what matters: the
                factors. Each dish, the service, vibe, and more.
              </Text>
            </Paragraph>

            <Paragraph size="lg">
              Ultimately though we think the problem comes down to platforms
              that are stagnant and don't trust their users. We want to prove
              you can build a high quality app and community that survives the
              test of time, culminating with a great map of the world that
              everyone can use, customize to their taste, and explore together.
              We'll be writing more about this on the blog.
            </Paragraph>

            <Paragraph size="lg">
              Dish is just getting started. It (kinda) works, in a sketchy, and
              fragile way. Some things are confusing, or poorly deliver on our
              message (including this about page!). We're working on that. But
              we put a lot of thought and work into the foundation, and we think
              we can deliver something better.{' '}
              <Link display="inline" href="mailto:team@dishapp.com">
                Let us know what you'd love to see
              </Link>
              .
            </Paragraph>

            <Paragraph size="lg">Enjoy 🌮🍜</Paragraph>

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
