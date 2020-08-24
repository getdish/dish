import { graphql } from '@dish/graph'
import {
  Button,
  Divider,
  HStack,
  Spacer,
  Text,
  TextProps,
  VStack,
} from '@dish/ui'
import React from 'react'
import { ScrollView } from 'react-native'

import { HomeStateItemAbout } from '../../state/home-types'
import { Link } from '../../views/ui/Link'
import { LinkButton } from '../../views/ui/LinkButton'
import { HomeScrollView } from './HomeScrollView'
import { HomeStackDrawer } from './HomeStackDrawer'
import { StackItemProps } from './HomeStackView'
import { Input } from './Input'
import TextArea from './TextArea'

const lightYellow = '#FCF3CF'
const lightGreen = '#D4EFDF'

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
              Food is diverse - what you care about when ordering
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
                  { name: '$$$', type: 'filter' },
                ]}
                {...inlineButton}
                backgroundColor={lightGreen}
              >
                fancy date
              </LinkButton>{' '}
              are completely different. A large list of ~4 star restaurants just
              isn't helpful. It forces you to read tons of comments to find
              &#8220;the one&#8221;.
            </Paragraph>

            <Paragraph size="xl">
              Delivery search is especially irksome - you can't search across
              services, while each has different results and ratings, and using
              Yelp means decor is factored when you just want a burrito.
            </Paragraph>

            <Paragraph size="lg">
              Dish is food search that solves these problems. It combines every
              top review site and every delivery service into{' '}
              <Strong>
                a summarized food guide, with ratings down to the dish
              </Strong>
              .
            </Paragraph>

            <Paragraph size="lg">
              Each restaurant is broken down by what makes it uniquely good.
              How? By looking at what{' '}
              <em>what people actually say, rather than rate</em>, and combining
              that with their expertise in each cuisine. This is all powered by
              a community that curates and writes, giving you smart, fun
              summaries of each restaurant.
            </Paragraph>

            <Paragraph size="lg">
              We think of it as a Hitchhiker's Guide to Gastronomy (or, a
              Pokédex for poke) - a pocket map of food where the stats are
              broken down and people work together to curate a map of gems
              unique to each place.
            </Paragraph>

            <Paragraph size="lg">
              <Strong>TL;DR</Strong>
            </Paragraph>

            <Paragraph size="xl">
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
