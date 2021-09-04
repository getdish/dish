import { RestaurantItemMeta, graphql, restaurant } from '@dish/graph'
import React, { memo } from 'react'
import { VStack } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { queryRestaurantTagScores } from '../../../queries/queryRestaurantTagScores'
import { TagButton, getTagButtonProps } from '../../views/TagButton'

export const RestaurantListItemScoreBreakdown = memo(
  graphql(
    ({
      activeTagSlugs,
      meta,
      restaurant,
    }: {
      activeTagSlugs?: string[]
      restaurant?: restaurant | null
      meta: RestaurantItemMeta
    }) => {
      const restaurantTags = queryRestaurantTagScores({
        restaurant,
        tagSlugs: activeTagSlugs ?? [],
      })
      return (
        <VStack spacing>
          {restaurantTags.map((rtag) => {
            return (
              <TagButton
                key={rtag.slug}
                {...getTagButtonProps(rtag)}
                votable
                restaurant={restaurant}
              />
            )
          })}
          {isWeb && process.env.NODE_ENV === 'development' && (
            <pre style={{ color: '#777' }}>{JSON.stringify(meta ?? null, null, 2)}</pre>
          )}
        </VStack>
      )
    }
  )
)
