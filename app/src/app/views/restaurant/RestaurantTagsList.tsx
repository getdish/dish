import { selectRishDishViewSimple } from '../../../helpers/selectDishViewSimple'
import { QueryRestaurantTagsProps, queryRestaurantTags } from '../../../queries/queryRestaurantTags'
import { TagButton, TagButtonProps, getTagButtonProps } from '../TagButton'
import { TagButtonTagProps } from '../TagButtonTagProps'
import { graphql, restaurant } from '@dish/graph'
import { Spacer, YStack } from '@dish/ui'
import { sortBy, uniqBy } from 'lodash'
import React, { Suspense, memo } from 'react'

type TagRowProps = {
  tagButtonProps?: TagButtonProps
  restaurant?: restaurant | null
  showMore?: boolean
  size?: TagButtonProps['size']
  maxLines?: number
  divider?: any
  excludeOverall?: boolean
  tags?: TagButtonTagProps[]
  spacing?: number
  spacingHorizontal?: number
  maxItems?: number
  exclude?: QueryRestaurantTagsProps['exclude']
}

export const RestaurantTagsList = (props: TagRowProps) => {
  const rowHeight = 50 * (props.size === '$5' ? 1.1 : props.size === '$3' ? 0.65 : 0.92)
  return (
    <>
      {/* may jump up a bit on load */}
      <Suspense fallback={<YStack height={rowHeight} />}>
        <Content {...props} />
      </Suspense>
    </>
  )
}

const Content = memo(
  graphql(function RestaurantTagsRow(props: TagRowProps) {
    const { size, restaurant, showMore, excludeOverall } = props
    if (!restaurant) {
      return null
    }
    let tags: TagButtonTagProps[] = []
    if (props.tags) {
      tags = props.tags.map(getTagButtonProps)
    } else {
      tags = queryRestaurantTags({
        restaurant,
        limit: props.maxItems,
        exclude: props.exclude,
      }).map(selectRishDishViewSimple)
    }
    if (showMore) {
      tags = tags.slice(0, 2)
    }
    tags = uniqBy(tags.slice(0, props.maxItems ?? Infinity), (x) => x.slug)
    if (excludeOverall) {
      tags = tags.filter((x) => x.slug !== 'lenses__gems')
    }
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
                restaurant={restaurant}
                {...props.tagButtonProps}
              />
              <Spacer size={props.spacing ?? 5} />
            </React.Fragment>
          )
        })}
      </>
    )
  })
)

RestaurantTagsList['defaultProps'] = {
  size: '$4',
}
