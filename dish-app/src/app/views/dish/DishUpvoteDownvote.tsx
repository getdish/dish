import { graphql, slugify } from '@dish/graph'
import React from 'react'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { useUserTagVotes } from '../../hooks/useUserTagVotes'
import { UpvoteDownvoteScore } from '../UpvoteDownvoteScore'

type Props = {
  size: 'sm' | 'md'
  name: string
  score?: number
  subtle?: boolean
  restaurantSlug?: string
  restaurantId?: string
}

export const DishUpvoteDownvote = (props: Props) => {
  if (!props.restaurantId || !props.restaurantSlug) {
    return null
  }
  return (
    <DishUpvoteDownvoteContent
      subtle={false}
      score={0}
      key={slugify(props.name) + props.restaurantSlug}
      {...props}
      restaurantId={props.restaurantId}
      restaurantSlug={props.restaurantSlug}
    />
  )
}

const DishUpvoteDownvoteContent = graphql(function DishUpvoteDownvote({
  size,
  name,
  subtle,
  score,
  restaurantSlug,
  restaurantId,
}: Required<Props>) {
  const intScore =
    score ??
    (restaurantSlug
      ? queryRestaurant(restaurantSlug).tags({
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
      showVoteOnHover
      subtle={subtle}
      size={size}
      score={intScore + vote}
      vote={vote}
      setVote={setVote}
    />
  )
})
