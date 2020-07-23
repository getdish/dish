import { graphql } from '@dish/graph'
import { Text, TextProps, VStack } from '@dish/ui'
import React from 'react'
import { ScrollView } from 'react-native'

import { HomeStateItemAbout } from '../../state/home'
import { HomeStackDrawer } from './HomeStackDrawer'
import { StackItemProps } from './HomeStackView'

export default graphql(function HomePageAbout({
  item,
}: StackItemProps<HomeStateItemAbout>) {
  return (
    <HomeStackDrawer closable title="About Dish">
      <ScrollView
        style={{ paddingHorizontal: 30, paddingVertical: 28, flex: 1 }}
      >
        <VStack spacing>
          <Text selectable fontSize={32} fontWeight="300" paddingRight={30}>
            Dish
          </Text>

          <VStack spacing>
            <Paragraph>
              Tired of finding shitty delivery food, and wasting lots of time
              finding it? Think there should be a better way to get great food
              fast?
            </Paragraph>

            <Paragraph>
              Hi, I'm Nathaniel Nathanson of Dish and I'm here to tell you about
              a revolutionary new way to get food, and get food now.
            </Paragraph>

            <Paragraph>
              For four easy payments of 19.999 we'll send you the Dish Guide™️,
              packed with tips, tricks, and money-saving deals.
            </Paragraph>
          </VStack>
        </VStack>
      </ScrollView>
    </HomeStackDrawer>
  )
})

const Paragraph = (props: TextProps) => {
  return <Text fontSize={18} lineHeight={30} selectable {...props} />
}
