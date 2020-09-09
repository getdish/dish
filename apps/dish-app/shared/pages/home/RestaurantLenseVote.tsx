import { graphql } from '@dish/graph'
import { HStack, StackProps } from '@dish/ui'
import { default as React, memo } from 'react'

import { tagLenses } from '../../state/tagLenses'
import { TagSmallButton } from './TagSmallButton'

export const RestaurantLenseVote = memo(
  graphql(
    ({ restaurantId, ...props }: StackProps & { restaurantId: string }) => {
      return (
        <HStack
          flexWrap="wrap"
          width="100%"
          spacing="sm"
          justifyContent="center"
          {...props}
        >
          {tagLenses.map((lense) => {
            return (
              <TagSmallButton
                key={lense.id}
                tag={lense}
                restaurantId={restaurantId}
              />
            )
          })}
        </HStack>
      )
    }
  )
)
