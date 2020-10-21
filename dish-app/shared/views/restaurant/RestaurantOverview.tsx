import { graphql } from '@dish/graph'
import { ellipseText } from '@dish/helpers'
import { capitalize } from 'lodash'
import React, { memo } from 'react'
import { AbsoluteVStack, HStack, Paragraph, Text, VStack } from 'snackui'

import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'

const quote = (
  <AbsoluteVStack top={-10} left={-0}>
    <Text fontSize={60} opacity={0.058}>
      &ldquo;
    </Text>
  </AbsoluteVStack>
)

export const RestaurantOverview = memo(
  graphql(function RestaurantOverview({
    restaurantSlug,
    fullHeight,
  }: {
    restaurantSlug: string
    fullHeight?: boolean
  }) {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const headlines = (restaurant.headlines() ?? [])
      .slice(0, 2)
      .map((x) => x.sentence)
      .join(' ')
    const summary = restaurant.summary || headlines
    const scale = 2.1 - Math.max(1.0, Math.min(1.1, summary.length / 250))
    const lineHeight = 26 * scale

    if (summary) {
      return (
        <HStack
          maxHeight={fullHeight ? 'auto' : lineHeight * 4 - 2}
          overflow="hidden"
          paddingHorizontal={30}
          marginHorizontal={-30}
          flex={1}
          alignSelf="center"
          position="relative"
        >
          {quote}
          <Text
            display="flex"
            marginTop="auto"
            marginBottom="auto"
            fontSize={16 * scale}
            lineHeight={lineHeight}
            opacity={1}
          >
            {ellipseText(
              summary
                .replace(/(\s{2,}|\n)/g, ' ')
                .split('. ')
                .map((sentence) => capitalize(sentence.trim()))
                .join('. '),
              {
                maxLength: 420,
              }
            )}
          </Text>
        </HStack>
      )
    }

    return null
  })
)

const defaultListItems = [
  {
    category: '🍽',
    sentence: `Don't miss the lychee tempura ice cream and Wednesday two-for-one`,
  },
  {
    category: '🌃',
    sentence: 'Traditional. Big bar area outside with shade',
  },
  // {
  //   category: 'Tips',
  //   sentence: 'Quick, cheap, local favorite',
  // },
]
