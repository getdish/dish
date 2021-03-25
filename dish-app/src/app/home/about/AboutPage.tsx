import React from 'react'
import { Image } from 'react-native'
import { AbsoluteVStack, Divider, H3, HStack, Paragraph, Spacer, Text, VStack } from 'snackui'

import dontPanic from '../../../assets/dont-panic.svg'
import {
  green,
  lightBlue,
  lightGreen,
  lightOrange,
  lightYellow,
  orange,
  purple,
} from '../../../constants/colors'
import { tagLenses } from '../../../constants/localTags'
import { HomeStateItemAbout } from '../../../types/homeTypes'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { LinkButton } from '../../views/LinkButton'
import { LogoColor } from '../../views/Logo'
import { StackDrawer } from '../../views/StackDrawer'
import { StackItemProps } from '../HomeStackView'
import { RatingView } from '../RatingView'
import { useSnapToFullscreenOnMount } from '../restaurant/useSnapToFullscreenOnMount'

const inlineButton = {
  borderRadius: 10,
  paddingHorizontal: 10,
  paddingVertical: 2,
  position: 'relative',
  display: 'inline-flex',
} as const

export default function AboutPage({ item, isActive }: StackItemProps<HomeStateItemAbout>) {
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

            <VStack marginVertical={10}>
              <LogoColor scale={2.5} />
            </VStack>
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
            <Paragraph textAlign="center" size="lg" fontWeight="800">
              A Hitchhiker's Guide
            </Paragraph>

            <Paragraph
              maxWidth={550}
              textAlign="center"
              size="xxxl"
              marginTop={-10}
              marginBottom={10}
              fontWeight="300"
              marginHorizontal="auto"
            >
              See what makes each restaurant unique, debate top lists of each dish
            </Paragraph>

            <Paragraph size="xl">
              These days finding a good
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
                bánh xèo
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
                backgroundColor={lightOrange}
                hoverStyle={{
                  backgroundColor: `${lightOrange}44`,
                }}
              >
                birria taco
              </LinkButton>{' '}
              requires Google-fu, 30 minutes and a lack of appetite. Too many hole-in-the-walls have
              great food and ⭐️⭐️⭐️ stars. Delivery apps have sketchy reviews and fake popups to
              boot.
            </Paragraph>

            <Paragraph size="xl">
              What you want when craving a dish, versus{' '}
              <LinkButton
                backgroundColor={lightGreen}
                hoverStyle={{
                  backgroundColor: `${lightGreen}44`,
                }}
                {...inlineButton}
                tags={[
                  tagLenses.find((x) => x.slug === 'lenses__veg')!,
                  { name: 'price-low', type: 'filter' },
                ]}
              >
                going vegetarian on a budget
              </LinkButton>
              , versus planning a{' '}
              <LinkButton
                tags={[
                  { name: 'Date', type: 'lense' },
                  { name: 'price-high', type: 'filter' },
                ]}
                {...inlineButton}
                backgroundColor={lightBlue}
                hoverStyle={{
                  backgroundColor: `${lightBlue}44`,
                }}
              >
                date night 🌃
              </LinkButton>{' '}
              don't fit neatly into five stars, and often five stars hides what you care about. Dish
              solves this in a few ways:
            </Paragraph>

            <H3>Ratings</H3>

            <Paragraph size="lg">
              Dish cuts one dimensional stars into a three-part flower giving you{' '}
              <Text fontWeight="700" color={green}>
                food
              </Text>
              ,{' '}
              <Text fontWeight="700" color={orange}>
                service
              </Text>{' '}
              and{' '}
              <Text fontWeight="700" color={purple}>
                ambience
              </Text>{' '}
              that's intuitive even at distance:
            </Paragraph>

            <HStack justifyContent="center" marginVertical={-10}>
              <RatingView rating={76} size={70} />
            </HStack>

            <H3>Stats</H3>

            <Paragraph size="lg">
              Dish crawls the web and gathers sentiment towards tags: birria-taco, service, vibe,
              veggie-friendly... then ranks each restaurant on exactly the tags you search for. You
              can see the top Chinese, but also the top Vegetarian Chinese Dim Sum, for delivery
              etc.
            </Paragraph>

            <H3>Lists</H3>

            <Paragraph size="lg">
              Vote on top lists in each area across any tags, plus make your own for yourself or
              others.
            </Paragraph>

            <Paragraph size="xl" fontWeight="800">
              To maintain a high quality though, we need to avoid becoming an ad company.
            </Paragraph>

            <Paragraph size="lg">
              Ultimately we're building what we want: a high quality Pokedex for the real world,
              driven by a community. We'll be writing more about how we plan to achieve this on{' '}
              <Link name="blog">the blog</Link>.
            </Paragraph>

            <Paragraph size="lg">
              Watch your step, it's early.{' '}
              <Link display="inline" href="mailto:team@dishapp.com">
                Let us know what you'd love to see
              </Link>
              .
            </Paragraph>

            <Paragraph size="lg">Cheers 🌮🍜</Paragraph>

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
