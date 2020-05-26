import { graphql, query } from '@dish/graph'
import { HStack } from '@dish/ui'
import React, { memo } from 'react'

import { useOvermind } from '../../state/useOvermind'
import { TagButton, TagButtonTagProps, getTagButtonProps } from './TagButton'
import { useHomeDrawerWidthInner } from './useHomeDrawerWidth'

type TagRowProps = {
  restaurantSlug: string
  showMore?: boolean
  size?: 'lg' | 'md'
  divider?: any
  tags?: TagButtonTagProps[]
}

export const RestaurantTagsRow = memo(
  graphql(function RestaurantTagsRow(props: TagRowProps) {
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

  let tags: TagButtonTagProps[] = []

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
    const restaurantTags = restaurant.tags({
      limit: 6,
    })
    // @ts-ignore
    tags = restaurantTags.map((tag) => tag.tag)
  }

  if (showMore) {
    tags = tags.slice(0, 2)
  }

  return tags.map((tag, index) => {
    return (
      <TagButton
        replace
        size="sm"
        rank={index}
        key={`${index}${tag.name}`}
        {...getTagButtonProps(tag)}
        votable={!!om.state.user.user}
      />
    )
  })
}
