import { graphql, slugify } from '@dish/graph'
import React from 'react'

import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { useUserTagVotes } from '../../hooks/useUserTagVotes'
import { UpvoteDownvoteScore } from '../UpvoteDownvoteScore'

export const DishUpvoteDownvote = graphql(function DishUpvoteDownvote({
  size,
  name,
  subtle,
  score,
  restaurantSlug,
  restaurantId,
}: {
  size: 'sm' | 'md'
  name: string
  score?: number
  subtle?: boolean
  restaurantSlug: string
  restaurantId: string
}) {
  const intScore =
    score ??
    (restaurantSlug
      ? useRestaurantQuery(restaurantSlug).tags({
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
        })[0]?.score ?? 0
      : 0)

  const { vote, setVote } = useUserTagVotes(restaurantSlug, {
    [slugify(name)]: true,
  })
  return (
    <UpvoteDownvoteScore
      subtle={subtle}
      size={size}
      score={intScore + vote}
      vote={vote}
      setVote={setVote}
    />
  )
})
