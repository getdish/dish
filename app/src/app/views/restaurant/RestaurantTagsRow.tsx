import { graphql } from '@dish/graph'
import { sortBy, uniqBy } from 'lodash'
import React, { Suspense, memo } from 'react'
import { HStack, Spacer, VStack } from 'snackui'

import { selectRishDishViewSimple } from '../../../helpers/selectDishViewSimple'
import { QueryRestaurantTagsProps, queryRestaurantTags } from '../../../queries/queryRestaurantTags'
import { TagButton, TagButtonProps, TagButtonTagProps, getTagButtonProps } from '../TagButton'

type TagRowProps = {
  tagButtonProps?: TagButtonProps
  restaurantSlug: string
  showMore?: boolean
  size?: TagButtonProps['size']
  maxLines?: number
  divider?: any
  tags?: TagButtonTagProps[]
  restaurantId?: string
  spacing?: number
  spacingHorizontal?: number
  maxItems?: number
  exclude?: QueryRestaurantTagsProps['exclude']
}

export const RestaurantTagsRow = (props: TagRowProps) => {
  const rowHeight = 50 * (props.size === 'lg' ? 1.2 : props.size === 'sm' ? 0.65 : 1)
  return (
    <HStack
      marginBottom={typeof props.spacing === 'number' ? -props.spacing : 0}
      maxHeight={rowHeight * (props.maxLines ?? 1)}
      maxWidth="100%"
      overflow="hidden"
      flexWrap="wrap"
    >
      {/* may jump up a bit on load */}
      <Suspense fallback={<VStack height={rowHeight} />}>
        <RestaurantTagsRowContent {...props} />
      </Suspense>
    </HStack>
  )
}

const RestaurantTagsRowContent = memo(
  graphql(function RestaurantTagsRow(props: TagRowProps) {
    const { size = 'sm', restaurantSlug, showMore } = props
    if (!restaurantSlug) {
      return null
    }
    let tags: TagButtonTagProps[] = []
    if (props.tags) {
      tags = props.tags.map(getTagButtonProps)
    } else {
      tags = queryRestaurantTags({
        restaurantSlug,
        limit: props.maxItems,
        exclude: props.exclude,
      }).map(selectRishDishViewSimple)
    }
    if (showMore) {
      tags = tags.slice(0, 2)
    }
    tags = uniqBy(tags.slice(0, props.maxItems ?? Infinity), (x) => x.slug)
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
                marginBottom={props.spacing ?? 5}
                marginRight={props.spacingHorizontal ?? 0}
                bordered
                replaceSearch
                hideRating
                hideRank
                size={size}
                {...tag}
                restaurantSlug={restaurantSlug}
                {...props.tagButtonProps}
              />
              <Spacer />
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
