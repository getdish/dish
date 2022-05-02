import { thirdPartyCrawlSources } from '../../../constants/thirdPartyCrawlSources'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { Link } from '../../views/Link'
import { PointsText } from '../../views/PointsText'
import { RestaurantSourcesBreakdown } from './RestaurantSourcesBreakdown'
import { graphql } from '@dish/graph'
import { Card, Text, TooltipSimple, XStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'

export const RestaurantSourcesBreakdownRow = memo(
  graphql(function RestaurantSourcesBreakdownRow({
    restaurantSlug,
    restaurantId,
    size = 'md',
  }: {
    restaurantSlug: string
    restaurantId: string
    size?: 'sm' | 'md'
  }) {
    const [restaurant] = queryRestaurant(restaurantSlug)
    const sources = {
      ...(restaurant?.sources?.() ?? {}),
    }
    return (
      <TooltipSimple
        placement="right"
        label={
          <Card width={280} minHeight={200}>
            <Suspense fallback={null}>
              <RestaurantSourcesBreakdown restaurantSlug={restaurantSlug} />
            </Suspense>
          </Card>
        }
      >
        <XStack
          padding={6}
          marginVertical={-6}
          borderRadius={100}
          hoverStyle={{
            backgroundColor: '$backgroundHover',
          }}
          position="relative"
          alignItems="center"
        >
          {Object.keys(sources)
            .filter((source) => thirdPartyCrawlSources[source]?.delivery === false)
            .map((source, i) => {
              const item = sources[source]
              const info = thirdPartyCrawlSources[source]
              return (
                <Link key={source} href={item.url}>
                  <XStack alignItems="center" paddingHorizontal={5} paddingVertical={3}>
                    {/* {info?.image ? (
                      <YStack className="faded-out">
                        <Image
                          source={info.image}
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 100,
                          }}
                        />
                      </YStack>
                    ) : null} */}
                    {/* <Spacer size={3} /> */}
                    <Text fontSize={14} color="rgba(0,0,0,0.7)">
                      {info?.name}
                    </Text>
                    {size !== 'sm' && (
                      <PointsText marginLeft={4} points={+(item.rating ?? 0) * 10} color="#999" />
                    )}
                  </XStack>
                </Link>
              )
            })}
        </XStack>
      </TooltipSimple>
    )
  })
)
