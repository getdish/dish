import { graphql } from '@dish/graph'
import React, { Suspense, useEffect, useRef } from 'react'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { useUserTagVotes } from '../../hooks/useUserTagVotes'
import { Score } from '../UpvoteDownvoteScore'

type Props = {
  size: 'sm' | 'md'
  slug: string
  score?: number
  rating?: number
  subtle?: boolean
  restaurantSlug?: string
  shadowed?: boolean
}

export const DishUpvoteDownvote = (props: Props) => {
  if (!props.restaurantSlug) {
    return null
  }
  return (
    <Suspense fallback={<Score size={props.size} score={0} rating={0} shadowed={props.shadowed} />}>
      <DishUpvoteDownvoteContent
        subtle={false}
        score={0}
        {...props}
        restaurantSlug={props.restaurantSlug}
      />
    </Suspense>
  )
}

const DishUpvoteDownvoteContent = graphql(
  ({ size, subtle, rating, score, restaurantSlug, slug, shadowed }: Props) => {
    const intScore =
      score ??
      (restaurantSlug
        ? queryRestaurant(restaurantSlug)[0]?.tags({
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

    const { vote, setVote } = useUserTagVotes(restaurantSlug || '', {
      [slug]: true,
    })

    return (
      <Score
        votable
        showVoteOnHover
        subtle={subtle}
        size={size}
        score={intScore + vote}
        rating={rating}
        vote={vote}
        shadowed={shadowed}
        setVote={setVote}
      />
    )
  }
)
