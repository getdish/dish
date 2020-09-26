import { slugify } from '@dish/graph'
import React from 'react'

import { useUserUpvoteDownvoteQuery } from '../../hooks/useUserUpvoteDownvoteQuery'
import { UpvoteDownvoteScore } from '../UpvoteDownvoteScore'

export const DishUpvoteDownvote = ({
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
  const { vote, setVote } = useUserUpvoteDownvoteQuery(restaurantId, {
    [slugify(name)]: true,
  })
  return (
    <UpvoteDownvoteScore
      subtle={subtle}
      size={size}
      score={100}
      vote={vote}
      setVote={setVote}
    />
  )
}
