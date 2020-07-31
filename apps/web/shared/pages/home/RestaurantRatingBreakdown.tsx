import { graphql } from '@dish/graph'
import { Text, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { Image } from 'react-native'

import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'
import { useRestaurantQuery } from './useRestaurantQuery'

export const RestaurantRatingBreakdown = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const sources = restaurant?.sources?.() ?? {}
    return (
      <>
        {Object.keys(sources).map((source, i) => {
          const item = sources[source]
          if (!item) {
            return null
          }
          const info = thirdPartyCrawlSources[source]
          return (
            <a
              className="see-through"
              style={{ flex: 1, maxWidth: 200 }}
              key={source}
              href={item.url}
              target="_blank"
            >
              <VStack
                padding={10}
                paddingHorizontal={20}
                alignItems="center"
                flex={1}
                borderRadius={10}
                margin={3}
                hoverStyle={{
                  backgroundColor: '#f2f2f2',
                }}
              >
                {info?.image ? (
                  <Image
                    source={info.image}
                    style={{ width: 24, height: 24, borderRadius: 100 }}
                  />
                ) : null}
                <Text fontSize={12} opacity={0.5} marginVertical={3}>
                  {info?.name ?? source}
                </Text>
                <Text>{item.rating ?? '-'}</Text>
              </VStack>
            </a>
          )
        })}
      </>
    )
  })
)
