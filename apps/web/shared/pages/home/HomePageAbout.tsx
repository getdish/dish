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
            <Paragraph size="xxl" lineHeight={36} fontWeight="300">
              Tired of finding underrated Vietnamese, Chinese, and Mexican
              places simply because they were holes in the wall, one day we
              realized - what you care about when ordering{' '}
              <LinkButton
                backgroundColor={lightYellow}
                {...inlineButton}
                tags={[
                  { name: 'Pho', type: 'dish' },
                  { name: 'delivery', type: 'filter' },
                ]}
              >
                delivery pho
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
                date night
              </LinkButton>{' '}
              are... different,{' '}
              <TextStrong>
                and a huge list of ~3-4 star restaurants just wasn't helpful
              </TextStrong>
              . This is especially true when ordering delivery where you care
              about specific dishes, or speed, and searching multiple apps is
              irksome.
            </Paragraph>

            <Paragraph size="xl">
              Dish crawls top rating sources and turns generic star-ratings into{' '}
              <TextStrong>
                <Text borderBottomWidth={2} borderBottomColor="#eee">
                  the factors each spot is good or bad at
                </Text>
                , with ratings down to the dish
              </TextStrong>
              . It even searches all delivery services at once. We look at{' '}
              <TextStrong>
                what people actually say, rather than just rate
              </TextStrong>
              , to help you find food that matches your mood ✨.
            </Paragraph>

            <Paragraph size="lg">
              We're building a community to help power it. We think of it as a
              Hitchhiker's Guide to Gastronomy (or, a Pokédex for poke) with the
              goal to create a more fun, collaborative, personal pocket map of
              the world.
            </Paragraph>

            <Spacer />

            <SmallTitle>TL;DR</SmallTitle>

            <Paragraph size="lg">
              <HStack marginVertical={4} alignItems="center">
                <Text marginHorizontal={10} fontSize={26}>
                  🗺
                </Text>{' '}
                Find uniquely good food with ratings down to the dish
              </HStack>
              <HStack marginVertical={4} alignItems="center">
                <Text marginHorizontal={10} fontSize={26}>
                  🚗
                </Text>{' '}
                Search across every delivery app at once
              </HStack>
              <HStack marginVertical={4} alignItems="center">
                <Text marginHorizontal={10} fontSize={26}>
                  ✨
                </Text>{' '}
                Community curation of what makes each area & restaurant special
              </HStack>
            </Paragraph>

            <Spacer />

            <SmallTitle>How?</SmallTitle>

            <Paragraph size="lg">
              We take what people write and extract sentiment towards dishes,
              ambiance, service and more. Then, as our community votes,
              comments, and tags, we summarize the data into a smart, fun
              summary. We power sentiment and summary with modern machine
              learning powered natural langauge technologies.
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
