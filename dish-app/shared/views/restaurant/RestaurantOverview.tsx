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
    maxChars = 250,
    limit = 2,
    inline,
  }: {
    restaurantSlug: string
    inline?: boolean
    limit?: number
    maxChars?: number
  }) {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const headlines = (restaurant.headlines() ?? defaultListItems).map(
      (x) => x.sentence
    )
    const summary = restaurant.summary ?? ''

    if (summary) {
      return (
        <HStack flex={1} overflow="hidden">
          <Paragraph size={1.1} opacity={1} height={116} overflow="hidden">
            {summary
              .split('. ')
              .map((sentence) => capitalize(sentence.trim()))
              .join('. ')}
          </Paragraph>
        </HStack>
      )
    }

    // TODO deprecate this

    const shownHeadlines = (summary
      ? [summary, ...headlines]
      : headlines
    ).slice(0, limit)

    if (inline) {
      return (
        <VStack
          maxWidth="100%"
          minHeight={118 + (limit - 1) * 40}
          position="relative"
          flex={1}
        >
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
                      maxLength: maxChars,
                    }
                  )}
                </Paragraph>
              </HStack>
            )
          })}
        </VStack>
      )
    }

    return (
      <>
        {headlines.slice(0, 4).map((item, index) => (
          <React.Fragment key={index}>
            <VStack
              {...(!inline && {
                minWidth: 150,
                backgroundColor: '#f2f2f2',
                borderRadius: 10,
                margin: 8,
                marginBottom: 0,
                marginRight: 0,
                padding: 12,
                flex: 1,
              })}
            >
              <Text fontSize={15}>
                <HStack
                  // @ts-ignore
                  display={isWeb ? 'inline-flex' : 'flex'}
                  width="10%"
                  minWidth={50}
                  marginRight={2}
                  alignItems="center"
                  justifyContent="flex-end"
                  {...(!inline && {
                    width: 'auto',
                    minWidth: 'auto',
                  })}
                >
                  <Text
                    paddingHorizontal={5}
                    borderRadius={18}
                    fontWeight="400"
                    color="rgba(0,0,0,0.5)"
                  >
                    {'🍽'}
                  </Text>
                </HStack>
                {item.sentence}
              </Text>
            </VStack>
            {index < headlines.length - 1 && <Spacer size={4} />}
          </React.Fragment>
        ))}
      </>
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
