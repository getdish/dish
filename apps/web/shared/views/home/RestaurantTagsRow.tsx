import { Restaurant } from '@dish/models'
import React, { memo } from 'react'
import { Text } from 'react-native'

import { HStack } from '../shared/Stacks'
import { RestaurantTagButton } from './RestaurantTagButton'
import { SecondaryText } from './SecondaryText'
import { TagButton } from './TagButton'

export const RestaurantTagsRow = memo(
  ({
    restaurant,
    showMore,
    size = 'md',
  }: {
    restaurant: Restaurant
    showMore?: boolean
    size?: 'lg' | 'md'
  }) => {
    const r = new Restaurant({
      tags: restaurant.tags,
      tag_rankings: restaurant.tag_rankings,
    })
    const tags = r.getTagsWithRankings() ?? []
    return (
      <HStack alignItems="center" spacing={size == 'lg' ? 8 : 4}>
        {showMore && (
          <RestaurantTagButton size={size} restaurant={restaurant} />
        )}
        {tags
          .slice(0, showMore ? 2 : 10)
          .map((tag, index) =>
            size == 'md' ? (
              <SecondaryText key={tag.name}>🍜 {tag.name}</SecondaryText>
            ) : (
              <TagButton
                key={`${index}${tag.name}`}
                rank={tag.rank}
                name={`🍜 ${tag.name}`}
                size={size}
              />
            )
          )}
        {!!showMore && <Text style={{ opacity: 0.5 }}>+ 5 more</Text>}
      </HStack>
    )
  }
)
