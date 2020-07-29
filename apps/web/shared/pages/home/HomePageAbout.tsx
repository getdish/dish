import { graphql } from '@dish/graph'
import { Button, Spacer, Text, TextProps, VStack } from '@dish/ui'
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
            Find that taco
          </Text>

          <VStack spacing="lg">
            <Paragraph>
              It's Saturday night and you want to order delivery. Specifically,
              you're craving a delicious crispy taco. But you'd like to find
              something actually good. What are you to do?
            </Paragraph>

            <Paragraph>
              Searching Yelp doesn't work - you can't search across delivery
              services - and their 5 star review captures service, ambiance,
              delivery speed, and wait time all in one. Plus, expert opinions
              count the same as first-timers.
            </Paragraph>

            <Paragraph>
              Dish aggregates all food reviewers and all delivery services, and
              puts the community in charge of curation. Think RottenTomatoes
              meets Reddit, for food. We index Yelp, Google, TripAdvisor, The
              Infatuation, Michelin, and every delivery service.
            </Paragraph>

            <Paragraph>
              We're still getting started, so things will be a little shaky. But
              we have a great foundation, and push updates every day. We'd love
              to hear feedback.
            </Paragraph>

            <Spacer size="xl" />

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
