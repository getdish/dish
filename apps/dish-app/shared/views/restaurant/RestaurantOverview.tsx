import { graphql } from '@dish/graph'
import { HStack, Spacer, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'

import { isWeb } from '../../constants'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'

export const RestaurantOverview = memo(
  graphql(
    ({
      restaurantSlug,
      inline,
      number,
    }: {
      restaurantSlug: string
      inline?: boolean
      limit?: number
    }) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const headlines = restaurant.headlines() ?? defaultListItems
      if (inline) {
        return (
          <>
            {headlines.slice(0, 3).map((item, i) => {
              return (
                <React.Fragment key={i}>
                  <HStack paddingVertical={2} flex={1} overflow="hidden">
                    <Text
                      fontSize={26}
                      opacity={0.3}
                      marginRight={6}
                      {...(isWeb && {
                        fontFamily: 'San Francisco, Times New Roman',
                      })}
                    >
                      &ldquo;
                    </Text>
                    <Text ellipse>{item.sentence}</Text>
                  </HStack>
                </React.Fragment>
              )
            })}
          </>
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
    }
  )
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
