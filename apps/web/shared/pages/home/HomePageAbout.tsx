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
          <Text selectable fontSize={32} fontWeight="300" paddingRight={30}>
            Find the best 🍜
          </Text>

          <VStack spacing="lg">
            <Paragraph>
              A quick bowl of pho, or slow-smoked ribs? A quaint place for a
              date, or Moroccon Medjool dates? A single star rating doesn't
              capture what you want... but, the comment section does - if you're
              willing to put in the work.
            </Paragraph>

            <Paragraph>
              What you want is a guide. One that understands what makes each
              place special, down to the dish (and ambiance, service, etc). The
              best delivery Pad Thai? Finding it today is a tango with 5
              delivery apps, each with inconsistent ratings.
            </Paragraph>

            <Paragraph>
              <strong>
                Dish aggregates from every food review source as well as every
                delivery app
              </strong>
              . It parses comments to extract specific ratings down to the dish.
              It's a new take on a simple, searchable food guide, built around a
              small community.
            </Paragraph>

            <Paragraph>
              Explore and debate the uniquely special cuisine in your area.
              Scratch your itch for a specific delivery craving. Vote and
              comment on definitive top lists: “the best dish/cuisine in
              region/city for mood/diet/expense”.
            </Paragraph>

            <Paragraph>
              It’s your Hitchhiker's Guide to Gastronomy: a fun and personal map
              of food you can curate to your taste and then collect your
              favorite places. Part guide, part Pokédex for the the food world.
              It's a smart, fun way to eat in or out.
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

const Paragraph = (props: TextProps) => {
  return (
    <Text
      fontSize={18}
      lineHeight={30}
      opacity={0.85}
      fontWeight="400"
      selectable
      {...props}
    />
  )
}
