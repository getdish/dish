import { graphql } from '@dish/graph'
import { HStack } from '@dish/ui'
import React, { memo } from 'react'

import { restaurantQuery } from './restaurantQuery'
import {
  TagButton,
  TagButtonProps,
  TagButtonTagProps,
  getTagButtonProps,
} from './TagButton'

type TagRowProps = {
  restaurantSlug: string
  showMore?: boolean
  size?: TagButtonProps['size']
  divider?: any
  tags?: TagButtonTagProps[]
  subtle?: boolean
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
      const restaurant = restaurantQuery(restaurantSlug)
      const restaurantTags = restaurant.tags({
        limit: 6,
      })
      // @ts-ignore
      tags = restaurantTags.map((tag) => tag.tag)
    }
    if (showMore) {
      tags = tags.slice(0, 2)
    }
    console.log('tags', tags)
    return (
      <HStack justifyContent="center" flexWrap="wrap">
        {tags.map((tag, index) => {
          return (
            <React.Fragment key={`${index}${tag.name}`}>
              <TagButton
                replace
                size={size ?? 'sm'}
                rank={index}
                {...getTagButtonProps(tag)}
                subtle={props.subtle}
                votable
                marginRight={5}
                marginBottom={5}
              />
            </React.Fragment>
          )
        })}
      </HStack>
    )
  })
)

RestaurantTagsRow['defaultProps'] = {
  size: 'md',
}
