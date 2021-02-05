import { graphql, slugify } from '@dish/graph'
import React from 'react'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { useUserTagVotes } from '../../hooks/useUserTagVotes'
import { UpvoteDownvoteScore } from '../UpvoteDownvoteScore'

type Props = {
  size: 'sm' | 'md'
  name: string
  slug: string
  score?: number
  rating?: number
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
      rating={0}
      key={slugify(props.name) + props.restaurantSlug}
      {...props}
      restaurantId={props.restaurantId}
      restaurantSlug={props.restaurantSlug}
    />
  )
}

const DishUpvoteDownvoteContent = graphql(function DishUpvoteDownvote({
  size,
  subtle,
  rating,
  score,
  restaurantSlug,
  slug,
}: Required<Props>) {
  const intScore =
    score ??
    (restaurantSlug
      ? queryRestaurant(restaurantSlug)[0].tags({
          limit: 1,
          where: {
            tag: {
              slug: {
                _eq: slug,
              },
            },
          },
        })[0]?.score ?? 0
      : 0)

  const { vote, setVote } = useUserTagVotes(restaurantSlug, {
    [slug]: true,
  })
  return (
    <UpvoteDownvoteScore
      showVoteOnHover
      subtle={subtle}
      size={size}
      score={intScore + vote}
      ratio={rating}
      vote={vote}
      setVote={setVote}
    />
  )
})
