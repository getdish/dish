import { graphql } from '@dish/graph'
import { Spacer, StackProps, VStack } from '@dish/ui'
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
  spacing?: number
  grid?: boolean
  max?: number
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
        // where: {
        //   tag: {
        //     type: {
        //       _neq: 'dish',
        //     },
        //   },
        // },
      })
      tags = restaurantTags.map((tag) => ({
        rank: tag.rank,
        rgb: tag.tag.rgb,
        name: tag.tag.name,
        type: tag.tag.type,
      }))
    }
    if (showMore) {
      tags = tags.slice(0, 2)
    }
    tags = tags.slice(0, props.max ?? Infinity)
    return (
      <>
        {tags
          .sort((a, b) => a.type?.localeCompare(b.type) ?? -1)
          .map((tag, index) => {
            return (
              <React.Fragment key={`${index}${tag.name}`}>
                <TagButton
                  replaceSearch
                  size={size ?? 'sm'}
                  rank={tag.rank}
                  {...getTagButtonProps(tag)}
                  subtle={props.subtle}
                  votable={!props.subtle}
                  restaurantId={props.restaurantId}
                />
                {!!props.spacing && <Spacer size={props.spacing} />}
              </React.Fragment>
            )
          })}
      </>
    )
  })
)

RestaurantTagsRow['defaultProps'] = {
  size: 'md',
}
