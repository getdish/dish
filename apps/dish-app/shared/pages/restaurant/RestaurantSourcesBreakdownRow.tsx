import { graphql } from '@dish/graph'
import { HStack, Spacer, Text, Tooltip, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { Image } from 'react-native'

import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { thirdPartyCrawlSources } from '../../thirdPartyCrawlSources'
import { PointsText } from '../../views/PointsText'

export const RestaurantSourcesBreakdownRow = memo(
  graphql(
    ({
      restaurantSlug,
      restaurantId,
    }: {
      restaurantSlug: string
      restaurantId: string
    }) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const sources = {
        dish: {
          rating: 3,
        },
        ...(restaurant?.sources?.() ?? {}),
      }
      return (
        <HStack position="relative" alignItems="center" flexWrap="wrap">
          {Object.keys(sources)
            .filter(
              (source) => thirdPartyCrawlSources[source]?.delivery === false
            )
            .map((source, i) => {
              const item = sources[source]
              const info = thirdPartyCrawlSources[source]
              return (
                <HStack
                  key={source}
                  alignItems="center"
                  paddingHorizontal={5}
                  paddingVertical={3}
                  borderRadius={100}
                >
                  {i !== 0 && (
                    <>
                      {info?.image ? (
                        <VStack className="faded-out">
                          <Image
                            source={info.image}
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: 100,
                            }}
                          />
                        </VStack>
                      ) : null}
                      <Spacer size={3} />
                      <Text fontSize={14} color="rgba(0,0,0,0.7)">
                        {info?.name}
                      </Text>
                    </>
                  )}
                  <PointsText
                    marginLeft={4}
                    points={+(item.rating ?? 0) * 10}
                    color="#999"
                  />
                </HStack>
              )
            })}
        </HStack>
      )
    }
  )
)
