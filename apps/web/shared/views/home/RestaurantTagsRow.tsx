import { query } from '@dish/graph'
import { TagType } from '@dish/models'
import { graphql } from '@gqless/react'
import React, { memo } from 'react'

import { useOvermind } from '../../state/useOvermind'
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
    return null
  }
  const [restaurant] = query.restaurant({
    where: {
      slug: {
        _eq: restaurantSlug,
      },
    },
  })
  let tags = restaurant.tags({
    limit: 6,
  })
  if (showMore) {
    tags = tags.slice(0, 2)
  }
  return tags.map((tag, index) => {
    return (
      <TagButton
        size="sm"
        rank={index}
        key={`${index}${tag.tag.name}`}
        name={tag.tag.name}
        type={tag.tag.type as TagType}
        icon={tag.tag.icon}
        rgb={tag.tag.rgb()}
        votable={!!om.state.user.user}
      />
    )
  })
}
