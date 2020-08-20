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
      <ScrollView
        style={{ paddingHorizontal: 38, paddingVertical: 38, flex: 1 }}
      >
        <VStack spacing="xl">
          <Title size="xl">The best 🍜, definitively</Title>

          <VStack spacing="lg">
            <Paragraph size="xxl">
              Eating out is diverse. What you look for when craving some{' '}
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
              compared to when you plan for a{' '}
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
              are unique - yet todays food search gives you a hundred ~4 star
              places, forcing you to scan through a ton of comments to find
              &#8220;the one&#8221;.
            </Paragraph>

            <Paragraph size="xl">
              This is especially frustrating with delivery where there are many
              apps, often with different restaurants and inconsistent ratings.
            </Paragraph>

            <Paragraph size="xl">
              Dish combines every top review site (Yelp, Michelin, and more)
              with every delivery service. It then looks at what{' '}
              <em>what people actually say</em>, rather than rate, to break
              things down to the factors that matter. That gives you:
            </Paragraph>

            <Paragraph size="xl">
              <HStack marginVertical={4} alignItems="center">
                <Text marginHorizontal={10} fontSize={32}>
                  🗺
                </Text>{' '}
                A map of what's uniquely good in each city, down to the dish
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
                What makes each restaurant special
              </HStack>
            </Paragraph>

            <Paragraph size="xl">
              Our community helps us curate and write reviews, which is then
              summarized using new AI-powered algorithms to generate a fun
              summary of each restaurant.
            </Paragraph>

            <Paragraph size="xl">
              We think of it as a Hitchhiker's Guide to Gastronomy - or, a
              Pokédex for poke - a pocket map of food where the stats are broken
              down and people work together to find gems.
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
  console.log(size, props.children)
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
