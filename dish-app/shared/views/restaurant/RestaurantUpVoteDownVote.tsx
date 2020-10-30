import { graphql } from '@dish/graph'
import React, { Suspense, memo } from 'react'
import { HoverablePopover } from 'snackui'

import { useUserTagVotes } from '../../hooks/useUserTagVotes'
import { HomeActiveTagsRecord } from '../../state/home-types'
import { Link } from '../ui/Link'
import { UpvoteDownvoteScore } from '../UpvoteDownvoteScore'

type UpvoteDownvoteProps = {
  restaurantId: string
  restaurantSlug: string
  score: number
  activeTags: HomeActiveTagsRecord
}

export const RestaurantUpVoteDownVote = (props: UpvoteDownvoteProps) => {
  return (
    <Suspense
      fallback={
        <UpvoteDownvoteScore
          marginLeft={-22}
          marginRight={-4}
          score={0}
          vote={0}
        />
      }
    >
      <RestaurantUpVoteDownVoteContents {...props} />
    </Suspense>
  )
}

const RestaurantUpVoteDownVoteContents = memo(
  graphql(function RestaurantUpVoteDownVote({
    restaurantId,
    restaurantSlug,
    score: baseScore,
    activeTags,
  }: UpvoteDownvoteProps) {
    const { vote, setVote } = useUserTagVotes(restaurantSlug, activeTags)
    const score = baseScore + vote
    return (
      <Link
        name="restaurantReviews"
        params={{
          id: restaurantId,
          slug: restaurantSlug,
        }}
        stopPropagation
      >
        <UpvoteDownvoteScore
          marginLeft={-22}
          marginRight={-4}
          score={score}
          vote={vote}
          setVote={setVote}
        />
      </Link>
    )
  })
)
