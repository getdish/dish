import { RESTAURANT_WEIGHTS, graphql, query, useQuery } from '@dish/graph'
import { Box, HoverablePopover, SmallTitle, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { Text } from 'react-native'

import { RatingViewProps } from './RatingView'
import RestaurantRatingView from './RestaurantRatingView'
import { TableCell, TableRow } from './TableRow'

export const RestaurantRatingViewPopover = memo(
  graphql(
    ({
      size = 'md',
      restaurantSlug,
    }: Partial<RatingViewProps> & { restaurantSlug: string }) => {
      const [restaurant] = query.restaurant({
        where: {
          slug: {
            _eq: restaurantSlug,
          },
        },
      })
      const sources = restaurant?.sources?.() ?? {}
      return (
        <HoverablePopover
          position="right"
          contents={
            <Box width={250}>
              <VStack>
                <SmallTitle>Rating Summary</SmallTitle>
                <TableRow>
                  <TableCell color="#555" fontWeight="600" width="50%">
                    <Text>Source</Text>
                  </TableCell>
                  <TableCell color="#555" fontWeight="600" width="25%">
                    <Text>Rating</Text>
                  </TableCell>
                  <TableCell color="#555" fontWeight="600" flex={1}>
                    <Text>Weight</Text>
                  </TableCell>
                </TableRow>
                {Object.keys(sources).map((source) => {
                  const item = sources[source]
                  if (!item) {
                    return null
                  }
                  return (
                    <TableRow key={source}>
                      <TableCell fontWeight="bold" width="50%">
                        {source}
                      </TableCell>
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
