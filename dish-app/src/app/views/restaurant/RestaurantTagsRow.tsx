import { graphql } from '@dish/graph'
import { sortBy } from 'lodash'
import React, { Suspense, memo } from 'react'
import { HStack, Spacer, StackProps, VStack } from 'snackui'

import { selectRishDishViewSimple } from '../../../helpers/selectDishViewSimple'
import { queryRestaurantTags } from '../../../queries/queryRestaurantTags'
import { TagButton, TagButtonProps, TagButtonTagProps, getTagButtonProps } from '../TagButton'

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

export const RestaurantTagsRow = (props: TagRowProps) => {
  const height = 80 * (props.size === 'lg' ? 1.2 : props.size === 'sm' ? 0.9 : 1)
  return (
    <HStack
      marginBottom={typeof props.spacing === 'number' ? -props.spacing : 0}
      maxHeight={height}
      maxWidth="100%"
      overflow="hidden"
      flexWrap="wrap"
    >
      {/* may jump up a bit on load */}
      <Suspense fallback={<VStack height={height} />}>
        <RestaurantTagsRowContent {...props} />
      </Suspense>
    </HStack>
  )
}

const RestaurantTagsRowContent = memo(
  graphql(function RestaurantTagsRow(props: TagRowProps) {
    const { size, restaurantSlug, showMore } = props
    if (!restaurantSlug) {
      return null
    }
    let tags: TagButtonTagProps[] = []
    if (props.tags) {
      tags = props.tags.map(getTagButtonProps)
    } else {
      tags = queryRestaurantTags({ restaurantSlug, limit: props.max }).map(selectRishDishViewSimple)
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
                restaurantSlug={restaurantSlug}
                marginBottom={props.spacing ?? 5}
                marginRight={props.spacing ?? 0}
              />
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
