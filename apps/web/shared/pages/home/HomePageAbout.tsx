import { graphql } from '@dish/graph'
import {
  Button,
  Divider,
  HStack,
  SmallTitle,
  Spacer,
  Text,
  TextProps,
  VStack,
} from '@dish/ui'
import React from 'react'
import { ScrollView } from 'react-native'

import { lightGreen, lightYellow } from '../../colors'
import { HomeStateItemAbout } from '../../state/home-types'
import { Link } from '../../views/ui/Link'
import { LinkButton } from '../../views/ui/LinkButton'
import { HomeScrollView } from './HomeScrollView'
import { HomeStackDrawer } from './HomeStackDrawer'
import { StackItemProps } from './HomeStackView'
import { Input } from './Input'
import TextArea from './TextArea'

const inlineButton = {
  borderRadius: 10,
  paddingHorizontal: 3,
  position: 'relative',
} as const

export default graphql(function HomePageAbout({
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
            <Paragraph size="xxl">
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
              <Strong>
                Seeing a huge list of ~4 star restaurants just isn't helpful
              </Strong>
              . Finding what you crave when ordering delivery is uniquely
              irksome - four apps, each with inconsistent ratings, and nowhere
              to search them all.
            </Paragraph>

            <Paragraph size="xl">
              <Strong>Dish breaks ratings down to the dish</Strong> - for every
              restaurant. It searches all delivery services at once, and
              combines reviews from every top rating source. It's a smarter food
              guide that{' '}
              <Strong>
                understands what people actually say about the factors that
                matter
              </Strong>{' '}
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
})

export type SizeName =
  | 'xxxs'
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl'

export type Size = number | SizeName
type SizableTextProps = TextProps & {
  size?: Size
  sizeLineHeight?: number
}

const Title = (props: SizableTextProps) => {
  const size = getSize(props.size) * 2.5
  return (
    <Paragraph
      fontWeight={size > 3.5 ? '200' : '300'}
      {...props}
      size={size}
      sizeLineHeight={0.7}
    />
  )
}

const Strong = (props: TextProps) => {
  return <Text fontWeight="500" {...props} />
}

const HighlightText = (props: TextProps) => {
  return (
    <Text
      borderRadius={8}
      paddingHorizontal={2}
      marginHorizontal={-2}
      {...props}
    />
  )
}

const Paragraph = ({
  size = 1,
  sizeLineHeight = 1,
  ...props
}: SizableTextProps) => {
  return (
    <Text
      fontSize={16 * getSize(size)}
      lineHeight={26 * getSize(size) * sizeLineHeight}
      color="rgba(0,0,0,0.85)"
      fontWeight="400"
      selectable
      {...props}
    />
  )
}

const sizes = {
  xxxs: 0.25,
  xxs: 0.5,
  xs: 0.75,
  sm: 0.9,
  md: 1,
  lg: 1.1,
  xl: 1.25,
  xxl: 1.5,
  xxxl: 1.8,
}

export const getSize = (size: Size): number => {
  if (typeof size === 'string') return sizes[size]
  return size ?? 1
}
