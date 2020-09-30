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
import React, { memo } from 'react'

import { isWeb } from '../../constants'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'

export const RestaurantOverview = memo(
  graphql(function RestaurantOverview({
    restaurantSlug,
    inline,
    number,
  }: {
    restaurantSlug: string
    inline?: boolean
    limit?: number
  }) {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const headlines = restaurant.headlines() ?? defaultListItems
    const shownHeadlines = headlines.slice(0, 2)
    if (inline) {
      return (
        <VStack minHeight={130} position="relative">
          <AbsoluteVStack top={-20} left={-35}>
            <Text
              fontSize={60}
              opacity={0.2}
              {...(isWeb && {
                fontFamily: 'San Francisco, Times New Roman',
              })}
            >
              &ldquo;
            </Text>
          </AbsoluteVStack>
          {shownHeadlines.map((item, i) => {
            return (
              <React.Fragment key={i}>
                <HStack flex={1} overflow="hidden">
                  <Paragraph
                    size={i == 0 ? 1.1 : 1}
                    opacity={i === 0 ? 1 : 0.7}
                    height={i == 0 ? 86 : 'auto'}
                    overflow="hidden"
                    // react native doesnt like using this as a prop...
                    {...(i !== 0 && {
                      ellipse: true,
                    })}
                    {...(i === 0 && {
                      numberOfLines: 3,
                    })}
                  >
                    {ellipseText(
                      item.sentence
                        .replace(/\n/g, ' ')
                        .replace(/[^\\/$a-z0-9 \,\.]+/gi, '')
                        .replace(/\s{2,}/g, ' ')
                        .toLowerCase()
                        .trim(),
                      {
                        maxLength: 150,
                      }
                    )}
                  </Paragraph>
                </HStack>
              </React.Fragment>
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
