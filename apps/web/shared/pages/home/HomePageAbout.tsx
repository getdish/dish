import { graphql } from '@dish/graph'
import { Button, Divider, Spacer, Text, TextProps, VStack } from '@dish/ui'
import React from 'react'
import { ScrollView } from 'react-native'

import { HomeStateItemAbout } from '../../state/home'
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
              Dish finds great food you'd have missed otherwise.
            </Paragraph>

            <Paragraph>
              Think RottenTomatoes - for dining and delivery.
            </Paragraph>

            <Paragraph>Search across every food delivery app!</Paragraph>

            <Paragraph>Find the best dishes in your city.</Paragraph>

            <Paragraph>
              Don't miss that "ultimate pho hole in the wall" .
            </Paragraph>

            <Divider marginVertical={40} />

            <Paragraph>We're growing into a real-world food Pokedex.</Paragraph>

            <Paragraph>Let us know what you'd like in it:</Paragraph>

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
      fontSize={22}
      lineHeight={30}
      opacity={0.85}
      fontWeight="400"
      selectable
      {...props}
    />
  )
}
