import { graphql } from '@dish/graph'
import { HStack, Spacer, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { Image } from 'react-native'

import { TextStrong } from './TextStrong'
import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'
import { useRestaurantQuery } from './useRestaurantQuery'

export const RestaurantScoreBreakdown = memo(
  graphql(({ restaurantSlug }: { restaurantSlug: string }) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const headlines = restaurant.headlines() ?? []
    const sources = restaurant?.sources?.() ?? {}
    return (
      <HStack overflow="hidden" maxWidth="100%" paddingVertical={12}>
        <VStack>
          <VStack spacing={8}>
            <Text color="rgba(0,0,0,0.5)">
              <TextStrong color="#000">+421</TextStrong> points from 280
              reviews:
            </Text>

            <VStack paddingLeft={10}>
              {headlines.slice(0, 3).map((item, i) => {
                return (
                  <li style={{ display: 'flex' }} key={i}>
                    <HStack key={i} flex={1} overflow="hidden">
                      <Text fontSize={14} color="rgba(0,0,0,0.7)" ellipse>
                        {item.sentence}
                      </Text>
                    </HStack>
                  </li>
                )
              })}
            </VStack>
          </VStack>

          <Spacer />

          <VStack spacing={10}>
            <Text color="rgba(0,0,0,0.5)">
              <TextStrong color="#000">+1893</TextStrong> points from 280
              reviews:
            </Text>

            <VStack>
              {Object.keys(sources).map((source, i) => {
                const item = sources[source]
                if (!item) {
                  return null
                }
                const info = thirdPartyCrawlSources[source]
                return (
                  <HStack
                    key={source}
                    padding={3}
                    paddingLeft={18}
                    alignItems="center"
                    flex={1}
                    hoverStyle={{
                      backgroundColor: '#f2f2f2',
                    }}
                    spacing={10}
                  >
                    {info?.image ? (
                      <Image
                        source={info.image}
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 100,
                        }}
                      />
                    ) : null}
                    <Text fontSize={12} opacity={0.5}>
                      {info?.name ?? source}
                    </Text>
                    <Text fontSize={13}>{+(item.rating ?? 0) * 10}</Text>
                    <Text>
                      Falafel Super Wrap, tasted great, the person who took
                    </Text>
                  </HStack>
                )
              })}
            </VStack>
          </VStack>
        </VStack>
      </HStack>
    )
  })
)
