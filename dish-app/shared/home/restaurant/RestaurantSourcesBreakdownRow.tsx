import { graphql } from '@dish/graph'
import React, { Suspense, memo } from 'react'
import { Image } from 'react-native'
import {
  Box,
  HStack,
  HoverablePopover,
  Spacer,
  Text,
  Tooltip,
  VStack,
} from 'snackui'

import { bgLight } from '../../constants/colors'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { thirdPartyCrawlSources } from '../../constants/thirdPartyCrawlSources'
import { PointsText } from '../../views/PointsText'
import { LinkButton } from '../../views/ui/LinkButton'
import { RestaurantSourcesBreakdown } from './RestaurantSourcesBreakdown'

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
    const restaurant = useRestaurantQuery(restaurantSlug)
    const sources = {
      ...(restaurant?.sources?.() ?? {}),
    }
    return (
      <HoverablePopover
        allowHoverOnContent
        // isOpen={restaurantSlug === 'molinari-delicatessen'}
        delay={800}
        position="right"
        contents={(isOpen) => {
          return (
            <Box width={280} minHeight={200}>
              <Suspense fallback={null}>
                {isOpen ? (
                  <RestaurantSourcesBreakdown restaurantSlug={restaurantSlug} />
                ) : null}
              </Suspense>
            </Box>
          )
        }}
      >
        <HStack
          padding={6}
          marginVertical={-6}
          borderRadius={100}
          hoverStyle={{
            backgroundColor: bgLight,
          }}
          position="relative"
          alignItems="center"
        >
          {Object.keys(sources)
            .filter(
              (source) => thirdPartyCrawlSources[source]?.delivery === false
            )
            .map((source, i) => {
              const item = sources[source]
              const info = thirdPartyCrawlSources[source]
              return (
                <LinkButton
                  key={source}
                  alignItems="center"
                  paddingHorizontal={5}
                  paddingVertical={3}
                  borderRadius={100}
                  href={item.url}
                >
                  <HStack>
                    {/* {info?.image ? (
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
                    ) : null} */}
                    {/* <Spacer size={3} /> */}
                    <Text fontSize={14} color="rgba(0,0,0,0.7)">
                      {info?.name}
                    </Text>
                    {size !== 'sm' && (
                      <PointsText
                        marginLeft={4}
                        points={+(item.rating ?? 0) * 10}
                        color="#999"
                      />
                    )}
                  </HStack>
                </LinkButton>
              )
            })}
        </HStack>
      </HoverablePopover>
    )
  })
)
