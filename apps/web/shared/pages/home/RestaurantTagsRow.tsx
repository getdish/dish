import { graphql } from '@dish/graph'
import { HStack, StackProps } from '@dish/ui'
import React, { memo } from 'react'

import {
  TagButton,
  TagButtonProps,
  TagButtonTagProps,
  getTagButtonProps,
} from './TagButton'
import { useRestaurantQuery } from './useRestaurantQuery'

type TagRowProps = {
  restaurantSlug: string
  showMore?: boolean
  size?: TagButtonProps['size']
  divider?: any
  tags?: TagButtonTagProps[]
  subtle?: boolean
  containerProps?: StackProps
  restaurantId?: string
}

export const RestaurantTagsRow = memo(
  graphql(function RestaurantTagsRow(props: TagRowProps) {
    // const drawerWidth = useHomeDrawerWidthInner()
    const { size, restaurantSlug, showMore } = props
    if (!restaurantSlug) {
      return null
    }
    let tags: TagButtonTagProps[] = []
    if (props.tags) {
      tags = props.tags
    } else {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const restaurantTags = restaurant.tags({
        limit: 10,
      })
      // @ts-ignore
      tags = restaurantTags.map((tag) => tag.tag)
    }
    if (showMore) {
      tags = tags.slice(0, 2)
    }
    return (
      <HStack
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        spacing={4}
        {...props.containerProps}
      >
        {tags.map((tag, index) => {
          return (
            <TagButton
              key={`${index}${tag.name}`}
              replaceSearch
              size={size ?? 'sm'}
              rank={index}
              {...getTagButtonProps(tag)}
              subtle={props.subtle}
              votable={!props.subtle}
              restaurantId={props.restaurantId}
            />
          )
        })}
      </HStack>
    )
  })
)

RestaurantTagsRow['defaultProps'] = {
  size: 'md',
}
