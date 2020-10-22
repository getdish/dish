import { graphql, order_by } from '@dish/graph'
import React, { memo } from 'react'
import { Spacer, StackProps } from 'snackui'

import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import {
  TagButton,
  TagButtonProps,
  TagButtonTagProps,
  getTagButtonProps,
} from '../TagButton'

type TagRowProps = {
  restaurantSlug: string
  showMore?: boolean
  size?: TagButtonProps['size']
  divider?: any
  tags?: TagButtonTagProps[]
  containerProps?: StackProps
  restaurantId?: string
  spacing?: number
  grid?: boolean
  max?: number
}

export const RestaurantTagsRow = memo(
  graphql(function RestaurantTagsRow(props: TagRowProps) {
    // const drawerWidth = useAppDrawerWidthInner()
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
        limit: props.max,
        where: {
          tag: {
            type: {
              _neq: 'dish',
            },
          },
        },
        order_by: [{ score: order_by.desc }],
      })
      tags = restaurantTags.map((tag) => ({
        rank: tag.rank,
        rgb: tag.tag.rgb,
        name: tag.tag.name,
        icon: tag.tag.icon,
        type: tag.tag.type,
        score: tag.score,
      }))
    }
    if (showMore) {
      tags = tags.slice(0, 2)
    }
    tags = tags.slice(0, props.max ?? Infinity)
    return (
      <>
        {tags
          .sort((a, b) =>
            a.type === 'lense'
              ? -2
              : a.type === 'cuisine'
              ? -1
              : a.score > b.score
              ? 1
              : 2
          )
          .map((tag, index) => {
            return (
              <React.Fragment key={`${index}${tag.name}`}>
                <TagButton
                  replaceSearch
                  size={size ?? 'sm'}
                  {...getTagButtonProps(tag)}
                  votable
                  restaurantSlug={props.restaurantSlug}
                  marginBottom={props.spacing ?? 5}
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
