import { graphql, restaurant } from '@dish/graph'
import React, { Suspense } from 'react'

import { useUserTagVotes } from '../../hooks/useUserTagVotes'
import { Score, ScoreProps } from '../Score'

type Props = ScoreProps & {
  slug: string
  restaurant?: restaurant | null
}

export const DishScore = (props: Props) => {
  if (!props.restaurant) {
    return null
  }
  return (
    <Suspense fallback={<Score size={props.size} score={0} rating={0} shadowed={props.shadowed} />}>
      <Content subtle={false} {...props} />
    </Suspense>
  )
}

const Content = graphql((props: Props) => {
  const { score, restaurant, slug, ...rest } = props
  const intScore =
    score ??
    restaurant?.tags({
      limit: 1,
      where: {
        tag: {
          slug: {
            _eq: slug,
          },
        },
      },
    })[0]?.score ??
    0

  const { vote, setVote } = useUserTagVotes({
    activeTags: [slug],
    restaurant,
  })

  return <Score showVoteOnHover setVote={setVote} {...rest} score={intScore / 2} />
})
