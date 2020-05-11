import { query } from '@dish/graph'
import { TagType } from '@dish/models'
import { graphql } from '@gqless/react'
import React, { memo } from 'react'

import { useOvermind } from '../../state/om'
import { HStack } from '../ui/Stacks'
import { TagButton } from './TagButton'
import { useHomeDrawerWidthInner } from './useHomeDrawerWidth'

type TagRowProps = {
  restaurantSlug: string
  showMore?: boolean
  size?: 'lg' | 'md'
  divider?: any
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

export const useGetTagElements = ({
  restaurantSlug,
  showMore,
}: TagRowProps) => {
  const om = useOvermind()

  if (!restaurantSlug) {
    console.warn('restaurantSlug', restaurantSlug)
    return null
  }

  const [restaurant] = query.restaurant({
    where: {
      slug: {
        _eq: restaurantSlug,
      },
    },
  })
  const tags = restaurant.tags({
    limit: 6,
  })
  return tags.slice(0, showMore ? 2 : 6).map((tag, index) => {
    return (
      <TagButton
        size="sm"
        rank={index}
        key={`${index}${tag.tag.name}`}
        name={tag.tag.name}
        type={tag.tag.type as TagType}
        votable={!!om.state.user.user}
      />
    )
  })
}
