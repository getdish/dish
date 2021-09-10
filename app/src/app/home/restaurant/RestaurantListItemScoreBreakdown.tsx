import { RestaurantItemMeta, graphql } from '@dish/graph'
import React, { memo } from 'react'
import { VStack } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { queryRestaurantTagScores } from '../../../queries/queryRestaurantTagScores'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { RestaurantListItemProps } from './RestaurantListItem'

export const RestaurantListItemScoreBreakdown = memo(
  graphql(
    ({
      activeTagSlugs,
      meta,
      restaurantSlug,
    }: RestaurantListItemProps & { meta: RestaurantItemMeta }) => {
      const restaurantTags = queryRestaurantTagScores({
        restaurantSlug,
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
                restaurantSlug={restaurantSlug}
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
