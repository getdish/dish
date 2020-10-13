import { graphql } from '@dish/graph'
import { ellipseText } from '@dish/helpers'
import {
  AbsoluteVStack,
  HStack,
  Paragraph,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import { capitalize } from 'lodash'
import React, { memo } from 'react'

import { isWeb } from '../../constants'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'

export const RestaurantOverview = memo(
  graphql(function RestaurantOverview({
    restaurantSlug,
    height,
  }: {
    restaurantSlug: string
    height?: number
  }) {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const headlines = (restaurant.headlines() ?? []).map((x) => x.sentence)
    const summary = restaurant.summary ?? ''

    if (summary) {
      return (
        <HStack flex={1} overflow="hidden">
          <Paragraph
            size={1}
            sizeLineHeight={0.8}
            lineHeight={22}
            opacity={1}
            height={height}
            overflow="hidden"
          >
            {summary
              .split('. ')
              .map((sentence) => capitalize(sentence.trim()))
              .join('. ')}
          </Paragraph>
        </HStack>
      )
    }

    if (headlines.length === 0) {
      return null
    }

    // TODO deprecate this

    const shownHeadlines = (summary
      ? [summary, ...headlines]
      : headlines
    ).slice(0, 1)

    return (
      <VStack maxWidth="100%" minHeight={118} position="relative" flex={1}>
        <AbsoluteVStack top={-20} left={-30}>
          <Text fontSize={60} opacity={0.08}>
            &ldquo;
          </Text>
        </AbsoluteVStack>
        {shownHeadlines.map((item, i) => {
          return (
            <HStack key={i} flex={1} overflow="hidden">
              <Paragraph
                size={i == 0 ? 1.1 : 1}
                opacity={i === 0 ? 1 : 0.7}
                height={i == 0 ? 114 : 'auto'}
                overflow="hidden"
                // react native doesnt like using this as a prop...
                {...(i !== 0 && {
                  ellipse: true,
                })}
                {...(i === 0 && {
                  numberOfLines: 4,
                })}
              >
                {ellipseText(
                  item
                    .replace(/\n/g, ' ')
                    .replace(/[^\\/$a-z0-9 \,\.]+/gi, '')
                    .replace(/\s{2,}/g, ' ')
                    .toLowerCase()
                    .trim(),
                  {
                    maxLength: 250,
                  }
                )}
              </Paragraph>
            </HStack>
          )
        })}
      </VStack>
    )
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
