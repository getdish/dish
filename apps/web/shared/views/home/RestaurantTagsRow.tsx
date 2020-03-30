import { Restaurant } from '@dish/models'
import React from 'react'
import { Text } from 'react-native'

import { HStack } from '../shared/Stacks'
import { SecondaryText } from './SecondaryText'
import { TagButton } from './TagButton'

export const RestaurantTagsRow = ({
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
    <HStack alignItems="center" spacing>
      {tags
        .slice(0, showMore ? 2 : 10)
        .map((tag) =>
          size == 'md' ? (
            <SecondaryText key={tag.name}>🍜 {tag.name}</SecondaryText>
          ) : (
            <TagButton
              key={tag.name}
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
