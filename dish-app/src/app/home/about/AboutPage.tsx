import React from 'react'
import { Image } from 'react-native'
import { AbsoluteVStack, Divider, H3, HStack, Paragraph, Spacer, Text, VStack } from 'snackui'

import dontPanic from '../../../assets/dont-panic.svg'
import { green, orange, purple } from '../../../constants/colors'
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

            <Paragraph size="xxl">
              Too many hole-in-the-walls have great food and ⭐️⭐️⭐️ stars. Good
              <LinkButton
                theme="yellow"
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
                theme="orange"
              >
                birria taco
              </LinkButton>{' '}
              should be a snap. Know how you have your favorite nights out, places to walk, . Search
              delivery apps have sketchy reviews and fake popups to boot.
            </Paragraph>

            <Paragraph size="xl">
              What you want when{' '}
              <LinkButton
                theme="green"
                {...inlineButton}
                tags={[
                  tagLenses.find((x) => x.slug === 'lenses__veg')!,
                  { name: 'price-low', type: 'filter' },
                ]}
              >
                going vegetarian on a budget
              </LinkButton>{' '}
              vs meeting for a{' '}
              <LinkButton
                tags={[
                  { name: 'Date', type: 'lense' },
                  { name: 'price-high', type: 'filter' },
                ]}
                {...inlineButton}
                theme="blue"
              >
                date night 🌃
              </LinkButton>{' '}
              don't really into into five stars, and often five stars hides what you care about.
              Dish solves this in a few ways:
            </Paragraph>

            <Paragraph size="xl">
              Vote on top lists in each area across any tags, plus make your own for yourself or
              others.
            </Paragraph>

            <Spacer />
            <Divider />

            <Paragraph size="xl">
              <AbsoluteVStack
                zIndex={1}
                bottom={0}
                right={15}
                width={85}
                height={85}
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
