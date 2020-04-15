import { Restaurant } from '@dish/models'
import React, { memo } from 'react'
import { ScrollView, Text } from 'react-native'

import { Divider } from '../ui/Divider'
import { Spacer } from '../ui/Spacer'
import { HStack } from '../ui/Stacks'
import { RestaurantTagButton } from './RestaurantTagButton'
import { SecondaryText } from './SecondaryText'
import { TagButton } from './TagButton'
import { useHomeDrawerWidthInner } from './useHomeDrawerWidth'

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
    const drawerWidth = useHomeDrawerWidthInner()
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack
          alignItems="center"
          minWidth={size === 'lg' ? drawerWidth : 0}
          justifyContent="center"
          spacing={size == 'lg' ? 8 : 8}
        >
          {tags.slice(0, showMore ? 2 : 10).map((tag, index) =>
            size == 'md' ? (
              <SecondaryText key={`${index}${tag.name}`}>
                🍜 {tag.name}
              </SecondaryText>
            ) : (
              <React.Fragment key={`${index}${tag.name}`}>
                {index !== 0 && <Divider vertical marginHorizontal={10} />}
                <TagButton
                  rank={tag.rank}
                  tag={{ ...tag, type: 'dish' }}
                  size={size}
                  subtle
                />
              </React.Fragment>
            )
          )}
          {/* {!!showMore && <Text style={{ opacity: 0.5 }}>+5</Text>} */}
        </HStack>
      </ScrollView>
    )
  }
)
