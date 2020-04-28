import { Restaurant } from '@dish/models'
import React, { memo } from 'react'
import { ScrollView, Text } from 'react-native'

import { Divider } from '../ui/Divider'
import { Link } from '../ui/Link'
import { Spacer } from '../ui/Spacer'
import { HStack } from '../ui/Stacks'
import { useMediaQueryIsSmall } from './HomeViewDrawer'
import { RestaurantTagButton } from './RestaurantTagButton'
import { SecondaryText } from './SecondaryText'
import { TagButton } from './TagButton'
import { useHomeDrawerWidthInner } from './useHomeDrawerWidth'

type TagRowProps = {
  restaurant: Restaurant
  showMore?: boolean
  size?: 'lg' | 'md'
  divider?: any
}

export const RestaurantTagsRow = memo((props: TagRowProps) => {
  const { size = 'md' } = props
  const isSmall = useMediaQueryIsSmall()
  const drawerWidth = useHomeDrawerWidthInner()
  return (
    <HStack
      justifyContent="center"
      minWidth={size === 'lg' ? drawerWidth : 0}
      spacing={size == 'lg' ? 10 : 10}
    >
      {getTagElements({ ...props, size })}
      {/* {!!showMore && <Text style={{ opacity: 0.5 }}>+5</Text>} */}
    </HStack>
  )
})

export const getTagElements = ({
  restaurant,
  showMore,
  size = 'md',
  divider,
}: TagRowProps) => {
  const r = new Restaurant({
    tags: restaurant.tags,
    tag_rankings: restaurant.tag_rankings,
  })
  const tags = r.getTagsWithRankings() ?? []
  return tags.slice(0, showMore ? 2 : 6).map((tag, index) => {
    const dividerEl =
      index !== 0
        ? divider ?? <Divider vertical marginHorizontal={10} maxHeight={14} />
        : null
    return (
      <React.Fragment key={`${index}${tag.name}`}>
        {dividerEl}
        {size == 'md' && (
          <Link
            key={`${index}${tag.name}`}
            inline
            tag={{ type: 'dish', ...tag }}
          >
            🍜 {tag.name}{' '}
            <span
              style={{
                marginBottom: -3,
                alignSelf: 'center',
                opacity: 0.4,
                fontSize: 10,
              }}
            >
              99
            </span>
          </Link>
        )}
        {size != 'md' && (
          <TagButton
            rank={tag.rank}
            tag={{ ...tag, type: 'dish' }}
            size={size}
            subtle
          />
        )}
      </React.Fragment>
    )
  })
}
