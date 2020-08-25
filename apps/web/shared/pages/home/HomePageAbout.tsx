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
              vs planning a{' '}
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
              are different.{' '}
              <Strong>
                A huge list of ~4 star restaurants just isn't helpful
              </Strong>
              . And with four different food delivery apps, it's at an
              especially frustrating time to find what you crave.
            </Paragraph>

            <Paragraph size="xl">
              Dish fixes food search by breaking down reviews from top sources
              around the web, combined with search across every restaurant and
              delivery services. It's{' '}
              <Strong>
                a smarter food guide, with ratings down to the dish and tips on
                what makes each place special ✨
              </Strong>
              .
            </Paragraph>

            <Paragraph size="lg">
              We look at <em>what people actually say</em>, rather than just
              rate, to extract ratings down the to dish, and down to each facet
              that matters. So instead of reading a ton of 4-star reviews and
              comments to find &#8220;the one&#8221;, our community has curated
              a master guide, giving you better results.
            </Paragraph>

            <Paragraph size="lg">
              Think of it as a Hitchhiker's Guide to Gastronomy (or, a Pokédex
              for poke) - a pocket map of the world where stats are broken down
              and people work together to curate the gems.
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
