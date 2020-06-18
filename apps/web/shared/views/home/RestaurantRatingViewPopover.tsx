import { RESTAURANT_WEIGHTS, graphql } from '@dish/graph'
import {
  Box,
  HStack,
  HoverablePopover,
  SmallTitle,
  TableCell,
  TableRow,
  Text,
  TextProps,
  VStack,
} from '@dish/ui'
import React, { memo } from 'react'
import { Image } from 'react-native'

import { RatingViewProps } from './RatingView'
import { restaurantQuery } from './restaurantQuery'
import RestaurantRatingView from './RestaurantRatingView'
import { thirdPartyCrawlSources } from './thirdPartyCrawlSources'

export const RestaurantRatingViewPopover = memo(
  graphql(
    ({
      size = 'md',
      restaurantSlug,
    }: Partial<RatingViewProps> & { restaurantSlug: string }) => {
      const restaurant = restaurantQuery(restaurantSlug)
      const sources = restaurant?.sources?.() ?? {}
      const headStyle: TextProps = {
        fontWeight: '300',
        fontSize: 13,
        color: '#555',
        paddingVertical: 8,
      }
      const padding = 10
      return (
        <HoverablePopover
          allowHoverOnContent
          position="bottom"
          contents={
            <Box width={320} padding={padding}>
              <SmallTitle>Rating Summary</SmallTitle>

              <TableRow>
                <Text width="50%" {...headStyle}>
                  Source
                </Text>
                <Text width="25%" {...headStyle}>
                  Rating
                </Text>
                <Text flex={1} {...headStyle}>
                  Weight
                </Text>
              </TableRow>

              <VStack>
                {Object.keys(sources).map((source, i) => {
                  const item = sources[source]
                  if (!item) {
                    return null
                  }
                  const info = thirdPartyCrawlSources[source]
                  return (
                    <TableRow
                      backgroundColor={i % 2 == 0 ? 'white' : '#f7f7f7'}
                      marginHorizontal={-10}
                      paddingHorizontal={10}
                      key={source}
                    >
                      <HStack width="50%" spacing={6} alignItems="center">
                        {info?.image ? (
                          <Image
                            source={info.image}
                            style={{ width: 26, height: 26, marginBottom: -4 }}
                          />
                        ) : null}
                        {info?.name ?? source}
                      </HStack>
                      <TableCell width="25%">{item.rating}</TableCell>
                      <TableCell flex={1}>
                        {RESTAURANT_WEIGHTS[source]}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </VStack>
            </Box>
          }
        >
          <RestaurantRatingView
            size={size}
            rating={restaurant?.rating}
            restaurantSlug={restaurantSlug}
          />
        </HoverablePopover>
      )
    }
  )
)
