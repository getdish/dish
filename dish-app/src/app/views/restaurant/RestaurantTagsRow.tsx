import { graphql } from '@dish/graph'
import { sortBy } from 'lodash'
import React, { memo } from 'react'
import { Spacer, StackProps } from 'snackui'
import { selectRishDishViewSimple } from '../../../helpers/selectDishViewSimple'
import { queryRestaurantTags } from '../../../queries/queryRestaurantTags'
import {
  getTagButtonProps, TagButton,
  TagButtonProps,
  TagButtonTagProps
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
    const { size, restaurantSlug, showMore } = props
    if (!restaurantSlug) {
      return null
    }
    let tags: TagButtonTagProps[] = []
    if (props.tags) {
      tags = props.tags.map(getTagButtonProps)
    } else {
      tags = queryRestaurantTags({ restaurantSlug, limit: props.max }).map(
        selectRishDishViewSimple
      )
    }
    if (showMore) {
      tags = tags.slice(0, 2)
    }
    tags = tags.slice(0, props.max ?? Infinity)
    return (
      <>
        {sortBy(tags, (tag) =>
          tag.type === 'lense'
            ? -2
            : tag.type === 'cuisine' || tag.type === 'country'
            ? -3
            : tag.score
        ).map((tag, index) => {
          return (
            <React.Fragment key={`${index}${tag.name}`}>
              <TagButton
                replaceSearch
                size={size ?? 'sm'}
                {...tag}
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
