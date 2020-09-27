import { graphql, query, slugify } from '@dish/graph'
import React from 'react'

import { useUserUpvoteDownvoteQuery } from '../../hooks/useUserUpvoteDownvoteQuery'
import { UpvoteDownvoteScore } from '../UpvoteDownvoteScore'

export const DishUpvoteDownvote = graphql(
  ({
    size,
    name,
    subtle,
    restaurantId,
  }: {
    size: 'sm' | 'md'
    name: string
    subtle?: boolean
    restaurantId: string
  }) => {
    const score =
      query
        .restaurant({
          where: {
            id: {
              _eq: restaurantId,
            },
          },
          limit: 1,
        })[0]
        .tags({
          limit: 1,
          where: {
            tag: {
              name: {
                _eq: name,
              },
              type: {
                _eq: 'dish',
              },
            },
          },
        })[0]?.['score'] ?? 0
    const { vote, setVote } = useUserUpvoteDownvoteQuery(restaurantId, {
      [slugify(name)]: true,
    })
    return (
      <UpvoteDownvoteScore
        subtle={subtle}
        size={size}
        score={score}
        vote={vote}
        setVote={setVote}
      />
    )
  }
)
