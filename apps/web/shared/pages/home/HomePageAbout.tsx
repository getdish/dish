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
        <VStack spacing="xxl">
          <Title size="xl">The best 🍜, definitively</Title>

          <VStack spacing="xl">
            <Paragraph size="xxxl" fontWeight="300">
              Craving pho? Vietnamese, Chinese, and Mexican joints often get
              lost behind poor ratings on ambiance and service.
            </Paragraph>

            <Paragraph size="xxl" fontWeight="300">
              We realized when ordering{' '}
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
              vs planning a{' '}
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
              you care about completely different things and{' '}
              <Text fontWeight="400">
                lists of ~4 star restuarants wasn't helping us find them very
                quickly
              </Text>
              .
            </Paragraph>

            <Paragraph size="xl">
              Dish collects reviews all over the food world (a bit like
              RottenTomatoes, for food) and looks at{' '}
              <TextStrong>what people actually say</TextStrong> - about specific
              dishes, the vibe, service - so you can find exactly what you want.
              Finding great dishes is really nice to have when ordering delivery
              too,{' '}
              <Text borderBottomColor="#eee" borderBottomWidth={2}>
                so Dish searches every delivery service
              </Text>{' '}
              at once.
            </Paragraph>

            <Paragraph size="lg">
              With reddit-style voting and sub-communities, we think we can
              build a better type of guide that grows over time. Dish wants to
              do two things:
              <ul>
                <li>
                  <TextStrong>Build a better discussion platform</TextStrong>.
                  One that gives users more control by understanding organic
                  review sentiment to generate a living "best of" guide.
                </li>
                <li>
                  <TextStrong>Letting restaurants relax a bit</TextStrong>.
                  Instead of having to please everyone to try and get 5 stars,
                  instead specialize on doing one thing well.
                </li>
              </ul>
              We think of it as a Hitchhiker's Guide to Gastronomy (or, a
              Pokédex for poke) - a fun pocket map of the world that we can work
              together to curate.
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

            <Divider marginVertical={40} />

            <Paragraph>
              <a href="mailto:team@dishapp.com">
                Let us know how you'd like to see us grow.
              </a>
            </Paragraph>

            <Spacer size="sm" />

            {/* <form>
              <VStack>
                <Input name="email" type="email" placeholder="Email..." />
                <TextArea name="comment" numberOfLines={100} />
                <Button>Submit</Button>
              </VStack>
            </form> */}

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
