import { Restaurant } from '@dish/models'
import React, { memo, useState } from 'react'
import { Text } from 'react-native'

import { Popover } from '../shared/Popover'
import { SmallTitle } from '../shared/SmallTitle'
import { Tooltip } from '../shared/Stack/Tooltip'
import { VStack } from '../shared/Stacks'
import { RatingView } from './RatingView'
import { TableCell, TableRow } from './TableRow'

export const RestaurantRatingDetail = memo(
  ({
    size = 'md',
    restaurant,
  }: {
    size?: 'lg' | 'md'
    restaurant: Restaurant
  }) => {
    const [isHoveringRating, setIsHoveringRating] = useState(false)
    return (
      <Popover
        isOpen={isHoveringRating}
        position="right"
        contents={
          <Tooltip height={300} width={250}>
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
              {Object.keys(restaurant.sources ?? {}).map((source) => {
                const item = restaurant.sources[source]
                return (
                  <TableRow key={source}>
                    <TableCell fontWeight="bold" width="50%">
                      {source}
                    </TableCell>
                    <TableCell width="25%">{item.rating}</TableCell>
                    <TableCell flex={1}>{Restaurant.WEIGHTS[source]}</TableCell>
                  </TableRow>
                )
              })}
            </VStack>
          </Tooltip>
        }
      >
        <div
          onMouseEnter={() => {
            setIsHoveringRating(true)
          }}
          onMouseLeave={() => {
            setIsHoveringRating(false)
          }}
        >
          <RatingView size={size} restaurant={restaurant} />
        </div>
      </Popover>
    )
  }
)
