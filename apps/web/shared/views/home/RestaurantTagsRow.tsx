import { Tag, TagType, graphql, query } from '@dish/graph'
import React, { memo } from 'react'

import { useOvermind } from '../../state/useOvermind'
import { HStack } from '../ui/Stacks'
import { TagButton, getTagButtonProps } from './TagButton'
import { useHomeDrawerWidthInner } from './useHomeDrawerWidth'

type TagRowProps = {
  restaurantSlug: string
  showMore?: boolean
  size?: 'lg' | 'md'
  divider?: any
  tags?: Tag[]
}

export const RestaurantTagsRow = memo(
  graphql((props: TagRowProps) => {
    const { size = 'md' } = props
    const drawerWidth = useHomeDrawerWidthInner()
    const tagElements = useGetTagElements({ ...props, size })
    return (
      <HStack
        justifyContent="center"
        minWidth={size === 'lg' ? drawerWidth : 0}
        spacing={size == 'lg' ? 10 : 10}
      >
        {tagElements}
        {/* {!!showMore && <Text style={{ opacity: 0.5 }}>+5</Text>} */}
      </HStack>
    )
  })
)

export const useGetTagElements = (props: TagRowProps) => {
  const { restaurantSlug, showMore } = props

  const om = useOvermind()

  if (!restaurantSlug) {
    return null
  }

  let tags: Tag[] = []

  if (props.tags) {
    tags = props.tags
  } else {
    const [restaurant] = query.restaurant({
      where: {
        slug: {
          _eq: restaurantSlug,
        },
      },
    })
    tags = restaurant.tags({
      limit: 6,
    })
  }

  if (showMore) {
    tags = tags.slice(0, 2)
  }

  return tags.map((tag, index) => {
    return (
      <TagButton
        size="sm"
        rank={index}
        key={`${index}${tag.tag.name}`}
        {...getTagButtonProps(tag.tag)}
        votable={!!om.state.user.user}
      />
    )
  })
}
