import { graphql } from '@dish/graph'
import {
  Button,
  Divider,
  HStack,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import React from 'react'

import { lightGreen, lightYellow } from '../../colors'
import { HomeStateItemAbout } from '../../state/home-types'
import { LinkButton } from '../../views/ui/LinkButton'
import { HomeScrollView } from './HomeScrollView'
import { HomeStackDrawer } from './HomeStackDrawer'
import { StackItemProps } from './HomeStackView'
import { Input } from './Input'
import { Paragraph } from './Paragraph'
import TextArea from './TextArea'
import { TextStrong } from './TextStrong'
import { Title } from './Title'

const inlineButton = {
  borderRadius: 10,
  paddingHorizontal: 3,
  position: 'relative',
} as const

export default function HomePageAbout({
  item,
}: StackItemProps<HomeStateItemAbout>) {
  return (
    <HomeStackDrawer closable title="About Dish">
      <HomeScrollView
        style={{
          paddingTop: 40,
          paddingHorizontal: '5%',
          paddingVertical: '5%',
          flex: 1,
        }}
      >
        <VStack spacing="xl">
          <Title size="xl">The best 🍜, definitively</Title>

          <VStack spacing="lg">
            <Paragraph size="xl">
              What you care about when ordering{' '}
              <LinkButton
                backgroundColor={lightYellow}
                {...inlineButton}
                tags={[
                  { name: 'Pho', type: 'dish' },
                  { name: 'delivery', type: 'filter' },
                ]}
              >
                quick, delivery pho
              </LinkButton>{' '}
              vs when planning a{' '}
              <LinkButton
                tags={[
                  { name: 'Date', type: 'lense' },
                  { name: 'price-high', type: 'filter' },
                ]}
                {...inlineButton}
                backgroundColor={lightGreen}
              >
                fancy date
              </LinkButton>{' '}
              is... different.{' '}
              <TextStrong>
                Seeing a huge list of ~4 star restaurants just isn't helpful
              </TextStrong>
              . Finding what you crave when ordering delivery is uniquely
              irksome - four apps, each with inconsistent ratings, and nowhere
              to search them all.
            </Paragraph>

            <Paragraph size="xl">
              <TextStrong>Dish breaks ratings down to the dish</TextStrong> -
              for every restaurant. It searches all delivery services at once,
              and combines reviews from every top rating source. It's a smarter
              food guide that{' '}
              <TextStrong>
                understands what people actually say about the factors that
                matter
              </TextStrong>{' '}
              so it can clue you into what makes a place special ✨.
            </Paragraph>

            <Paragraph size="lg">
              We're a community of food experts collaborating on a Hitchhiker's
              Guide to Gastronomy (a poke Pokédex) to create a more fun,
              personal pocket map to the world of food.
            </Paragraph>

            <Spacer />

            <SmallTitle>How?</SmallTitle>

            <Paragraph size="lg">
              We take what people write, then extract sentiment towards dishes,
              ambiance, service and more. Then, as our community votes and
              comments, we summarize top reviews and tags into a smart, fun
              summary. The result - instead of sifting through a ton of comments
              to find &#8220;the one&#8221;, Dish describes facets you care
              about, so you can spend less time hunting and more time enjoying.
            </Paragraph>

            <Spacer />

            <SmallTitle>TL;DR</SmallTitle>

            <Paragraph size="lg">
              <HStack marginVertical={4} alignItems="center">
                <Text marginHorizontal={10} fontSize={32}>
                  🗺
                </Text>{' '}
                Find uniquely good food with ratings down to the dish
              </HStack>
              <HStack marginVertical={4} alignItems="center">
                <Text marginHorizontal={10} fontSize={32}>
                  🚗
                </Text>{' '}
                Search across every delivery app at once
              </HStack>
              <HStack marginVertical={4} alignItems="center">
                <Text marginHorizontal={10} fontSize={32}>
                  ✨
                </Text>{' '}
                Community curation of what makes each area & restaurant special
              </HStack>
            </Paragraph>

            <Divider marginVertical={40} />

            <Paragraph>Let us know how you'd like to see grow:</Paragraph>

            <Spacer size="sm" />

            <form>
              <VStack>
                <Input name="email" type="email" placeholder="Email..." />
                <TextArea name="comment" numberOfLines={100} />
                <Button>Submit</Button>
              </VStack>
            </form>

            <Spacer />
            <Spacer />
            <Spacer />
            <Spacer />
          </VStack>
        </VStack>
      </HomeScrollView>
    </HomeStackDrawer>
  )
}
