import { graphql, query } from '@dish/graph'
import { HStack } from '@dish/ui'
import React, { memo } from 'react'

import { memoize } from '../../helpers/memoizeWeak'
import { useOvermind } from '../../state/useOvermind'
import { restaurantQuery } from './restaurantQuery'
import { TagButton, TagButtonTagProps, getTagButtonProps } from './TagButton'
import { useHomeDrawerWidthInner } from './useHomeDrawerWidth'

type TagRowProps = {
  restaurantSlug: string
  showMore?: boolean
  size?: 'lg' | 'md'
  divider?: any
  tags?: TagButtonTagProps[]
  subtle?: boolean
}

export const RestaurantTagsRow = memo(
  graphql(function RestaurantTagsRow(props: TagRowProps) {
    console.log(
      'RestaurantTagsRow - for whatever reason this takes a while and renders in a wierd time'
    )
    const drawerWidth = 100 //useHomeDrawerWidthInner()
    // const om = useOvermind()
    const tagElements = getTagElements(true, props)
    return (
      <HStack
        justifyContent="center"
        minWidth={props.size === 'lg' ? drawerWidth : 0}
        spacing={props.size == 'lg' ? 10 : 10}
      >
        {tagElements}
      </HStack>
    )
  })
)

RestaurantTagsRow['defaultProps'] = {
  size: 'md',
}

export const getTagElements = memoize(
  (votable: boolean, props: TagRowProps) => {
    const { restaurantSlug, showMore } = props

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

    return tags.map((tag, index) => {
      return (
        <TagButton
          replace
          size="sm"
          rank={index}
          key={`${index}${tag.name}`}
          {...getTagButtonProps(tag)}
          subtle={props.subtle}
          votable={votable}
        />
      )
    })
  }
)
