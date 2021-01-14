import { graphql } from '@dish/graph'
import { sortBy } from 'lodash'
import React, { memo } from 'react'
import { Spacer, StackProps } from 'snackui'

import { queryRestaurantTags } from '../../../queries/queryRestaurantTags'
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
    // 🚨 BAD HOOKS ALERT
    if (props.tags) {
      tags = props.tags
    } else {
      tags = queryRestaurantTags({ restaurantSlug, limit: props.max })
    }
    if (showMore) {
      tags = tags.slice(0, 2)
    }
    tags = tags.slice(0, props.max ?? Infinity)
    return (
      <>
        {sortBy(tags, (a) =>
          a.type === 'lense'
            ? -2
            : a.type === 'cuisine' || a.type === 'country'
            ? -3
            : a.score
        ).map((tag, index) => {
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
