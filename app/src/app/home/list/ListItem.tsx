import { graphql, refetch, restaurant, review } from '@dish/graph'
import React, { useState } from 'react'

import { ListItemContentMinimal } from './ListItemContentMinimal'
import { ListItemContentModern } from './ListItemContentModern'

export type ListItemProps = {
  listTheme?: 'modern' | 'minimal'
  reviewQuery?: review[] | null
  username?: string
  restaurant: restaurant
  listSlug?: string
  hideRate?: boolean
  rank: number
  activeTagSlugs?: string[]
  onFinishRender?: Function
  editable?: boolean
  hideTagRow?: boolean
  above?: any
}

export type ListItemContentProps = ListItemProps & {
  onUpdate: Function
  isEditing: boolean
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

export const ListItem = graphql((props: ListItemProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const listItemContentProps = {
    ...props,
    isEditing,
    setIsEditing,
    onUpdate: () => {
      if (props.reviewQuery) refetch(props.reviewQuery)
    },
  }

  // we need to be sure to render them all first pass so they fetch once,
  // then second pass it will hide all but one
  const Element = props.listTheme === 'minimal' ? ListItemContentMinimal : ListItemContentModern

  // controlled
  if (props.reviewQuery) {
    return <Element {...listItemContentProps} />
  }

  // otherwise determine the right review to show (first list-specific, then user, then generic)
  const listReview = props.listSlug
    ? props.restaurant.reviews({
        where: {
          username: {
            _eq: props.username,
          },
          list: {
            slug: {
              _eq: props.listSlug,
            },
          },
          text: {
            _neq: '',
          },
        },
        limit: 1,
      })
    : null

  const userReview = props.restaurant.reviews({
    where: {
      username: {
        _eq: props.username,
      },
      text: {
        _neq: '',
      },
    },
    limit: 1,
  })

  // const topReview = isEditing
  //   ? null
  //   : props.restaurant.reviews({
  //       where: {
  //         text: {
  //           _neq: '',
  //         },
  //       },
  //       limit: 1,
  //       order_by: [{ vote: order_by.desc }],
  //     })

  const hasListReview = !!listReview?.[0]?.text
  const hasUserReview = !!userReview?.[0]?.text

  const isLoading = listReview?.[0] && listReview?.[0].text === undefined

  listItemContentProps.onUpdate = () => {
    // if (topReview) refetch(topReview)
    if (userReview) refetch(userReview)
    if (listReview) refetch(listReview)
  }

  if (isEditing || hasListReview) {
    return <Element {...listItemContentProps} reviewQuery={listReview} />
  }
  if (hasUserReview) {
    return <Element {...listItemContentProps} reviewQuery={userReview} />
  }
  if (isLoading) {
    return (
      <>
        {/* <Element {...listItemContentProps} reviewQuery={topReview} /> */}
        <Element {...listItemContentProps} reviewQuery={userReview} />
        <Element {...listItemContentProps} reviewQuery={listReview} />
      </>
    )
  }
  return <Element {...listItemContentProps} />
})
