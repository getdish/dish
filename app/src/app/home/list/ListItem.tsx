import { graphql, order_by, refetch } from '@dish/graph'
import { useState } from 'react'

import { ListItemContentMinimal } from './ListItemContentMinimal'
import { ListItemContentModern } from './ListItemContentModern'
import { ListItemProps } from './ListItemProps'

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

  // const topReview = props.restaurant.reviews({
  //   where: {
  //     text: {
  //       _neq: '',
  //     },
  //     source: {
  //       _neq: null,
  //     },
  //   },
  //   limit: 1,
  //   order_by: [
  //     {
  //       sentiments_aggregate: {
  //         avg: {
  //           ml_sentiment: order_by.desc,
  //         },
  //       },
  //     },
  //   ],
  // })

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
  // if (topReview) {
  //   return <Element {...listItemContentProps} reviewQuery={topReview} isExternalReview />
  // }
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
