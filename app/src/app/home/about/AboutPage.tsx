import React from 'react'
import { Image } from 'react-native'
import {
  AbsoluteVStack,
  Divider,
  Paragraph,
  Spacer,
  Theme,
  UnorderedList,
  UnorderedListItem,
  VStack,
} from 'snackui'

import dontPanic from '../../../assets/dont-panic.svg'
import { HomeStateItemAbout } from '../../../types/homeTypes'
import { TagLine } from '../../TagLine'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { LogoColor } from '../../views/Logo'
import { StackDrawer } from '../../views/StackDrawer'
import { StackItemProps } from '../HomeStackView'
import { useSnapToFullscreenOnMount } from '../restaurant/useSnapToFullscreenOnMount'

// const inlineButton = {
//   borderRadius: 10,
//   paddingHorizontal: 10,
//   paddingVertical: 2,
//   position: 'relative',
//   display: 'inline-flex',
// } as const

export default function AboutPage({ item, isActive }: StackItemProps<HomeStateItemAbout>) {
  useSnapToFullscreenOnMount()

  // would be cute but we need to modify it to show anything not just restaurants
  // useSetAppMap({
  //   isActive,
  //   results: [
  //     {

  //     }
  //   ]
  // })

  return (
    <StackDrawer closable title="About Dish">
      <ContentScrollView id="about">
        <VStack spacing="xl">
          <VStack
            // marginLeft={-60}
            // marginRight={20}
            // paddingLeft={60}
            borderRadius={60}
            maxWidth="100%"
            alignItems="center"
            position="relative"
          >
            <Spacer size="xl" />
            <LogoColor scale={2} />
          </VStack>

          <VStack paddingHorizontal="5%" spacing="xl">
            <Paragraph size="xxl">
              Dish is your pocket guide to the world. We aggregate amazing ratings, and are building
              a sub-communities platform for curation.{' '}
              <Link href="https://discord.gg/f4u9hgmf">
                We're launching on ethereum and forming a DAO, join our discord
              </Link>
              .
            </Paragraph>

            <UnorderedList>
              <UnorderedListItem sizeLineHeight={1.05} size="xl">
                Aggregates reviews across everything: Michelin, TripAdvisor, The Infatuation, Yelp,
                Google, DoorDash, GrubHub and more - like RottenTomatoes for food
              </UnorderedListItem>
              <UnorderedListItem sizeLineHeight={1.05} size="xl">
                Searches every delivery service at once
              </UnorderedListItem>
              <UnorderedListItem sizeLineHeight={1.05} size="xl">
                Pays in crypto for contributions
              </UnorderedListItem>
              <UnorderedListItem sizeLineHeight={1.05} size="xl">
                Regional and group-based governance
              </UnorderedListItem>
            </UnorderedList>

            <Spacer />
            <Divider />

            <Paragraph size="xl">
              <AbsoluteVStack
                zIndex={1}
                bottom={0}
                right={15}
                width={85}
                height={85}
                rotate="12deg"
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
