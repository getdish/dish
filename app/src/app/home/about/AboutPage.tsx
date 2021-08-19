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
import { tagLenses } from '../../../constants/localTags'
import { HomeStateItemAbout } from '../../../types/homeTypes'
import { TagLine } from '../../TagLine'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { LinkButton } from '../../views/LinkButton'
import { LogoColor } from '../../views/Logo'
import { StackDrawer } from '../../views/StackDrawer'
import { IntroText } from '../blog/IntroText'
import { StackItemProps } from '../HomeStackView'
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
            <TagLine />
          </VStack>

          <VStack paddingHorizontal="5%" spacing="xl">
            <Theme name="yellow">
              <Paragraph size="xl">
                <Link href="">We're launching a blockchain and DAO, join our discord</Link>
              </Paragraph>
            </Theme>

            <Paragraph size="xl">
              Dish is in early beta, it's aim is to be a nicer guide to the world:
            </Paragraph>

            <UnorderedList>
              <UnorderedListItem size="xl">
                Aggregated reviews - like RottenTomatoes for food
              </UnorderedListItem>
              <UnorderedListItem size="xl">
                Searches every delivery service at once
              </UnorderedListItem>
              <UnorderedListItem size="xl">Pays in crypto for contributions</UnorderedListItem>
              <UnorderedListItem size="xl">Regional and group-based governance</UnorderedListItem>
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
