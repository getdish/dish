import { graphql } from '@dish/graph'
import React, { Suspense } from 'react'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { useUserTagVotes } from '../../hooks/useUserTagVotes'
import { Score, ScoreProps } from '../Score'

type Props = ScoreProps & {
  slug: string
  restaurantSlug?: string
}

export const DishScore = (props: Props) => {
  if (!props.restaurantSlug) {
    return null
  }
  return (
    <Suspense fallback={<Score size={props.size} score={0} rating={0} shadowed={props.shadowed} />}>
      <Content subtle={false} {...props} restaurantSlug={props.restaurantSlug} />
    </Suspense>
  )
}

const Content = graphql((props: Props) => {
  const { score, restaurantSlug, slug, ...rest } = props
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

  return <Score showVoteOnHover setVote={setVote} {...rest} score={intScore + vote} />
})
