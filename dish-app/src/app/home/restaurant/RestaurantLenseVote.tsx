import { graphql } from '@dish/graph'
import React, { memo } from 'react'
import { HStack, StackProps } from 'snackui'

import { tagLenses } from '../../../constants/localTags'
import { TagSmallButton } from '../../views/TagSmallButton'

export const RestaurantLenseVote = memo(
  graphql(
    ({ restaurantSlug, ...props }: StackProps & { restaurantSlug: string }) => {
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
                restaurantSlug={restaurantSlug}
              />
            )
          })}
        </HStack>
      )
    }
  )
)
