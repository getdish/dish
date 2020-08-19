import { graphql } from '@dish/graph'
import { Button, Divider, Spacer, Text, TextProps, VStack } from '@dish/ui'
import React from 'react'
import { ScrollView } from 'react-native'

import { HomeStateItemAbout } from '../../state/home-types'
import { HomeStackDrawer } from './HomeStackDrawer'
import { StackItemProps } from './HomeStackView'
import { Input } from './Input'
import TextArea from './TextArea'

export default graphql(function HomePageAbout({
  item,
}: StackItemProps<HomeStateItemAbout>) {
  return (
    <HomeStackDrawer closable title="About Dish">
      <ScrollView
        style={{ paddingHorizontal: 38, paddingVertical: 38, flex: 1 }}
      >
        <VStack spacing="xl">
          <Title size="xxl">The best 🍜, definitively</Title>

          <VStack spacing="lg">
            <Paragraph size="xl">
              When you want a <em>quick</em> bowl of pho, or a <em>nice</em>{' '}
              place for a date, a bunch of 4.0 star restaurants just isn't
              helpful... finding &#8220;the one&#8221; shouldn't require reading
              pages of comments.
            </Paragraph>

            <Paragraph>
              We're building a living guide powered by{' '}
              <em>what people say, not rate</em> to power lists of uniquely good
              food. It also{' '}
              <Strong>searches every food delivery app at once</Strong>, which
              is handy.
            </Paragraph>

            <Paragraph>
              Our community helps us curate reviews from every top source - from
              Yelp to Michelin and beyond - adding tips and tags so that reviews
              can be summarized into fun descriptions for each place.
            </Paragraph>

            <Divider marginVertical={40} />

            <Paragraph size="xl">
              We think of it as your Hitchhiker's Guide to Gastronomy - or, your
              own Pokédex for poke - a curated map, personal, with stats broken
              down, and simple, effective descriptions. Your pocket guide to the
              food world.
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
      </ScrollView>
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
      fontWeight={size > 3 ? '200' : '300'}
      {...props}
      size={size}
      sizeLineHeight={0.7}
    />
  )
}

const Strong = (props: SizableTextProps) => {
  return <Text fontWeight="500" {...props} />
}

const Paragraph = ({
  size = 1,
  sizeLineHeight = 1,
  ...props
}: SizableTextProps) => {
  console.log(size, props.children)
  return (
    <Text
      fontSize={16 * getSize(size)}
      lineHeight={28 * getSize(size) * sizeLineHeight}
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
