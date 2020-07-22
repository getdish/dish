import { Review, Tag, query, reviewUpsert, tagUpsert } from '@dish/graph'
import { useState } from 'react'

import { HomeActiveTagIds } from '../../state/home'
import { useOvermind } from '../../state/useOvermind'

export const useUserReviews = (restaurantId: string): Review[] => {
  const om = useOvermind()
  const userId = om.state.user.user?.id
  if (userId) {
    const reviews = query.review({
      limit: 1,
      where: {
        restaurant_id: {
          _eq: restaurantId,
        },
        user_id: {
          _eq: userId,
        },
      },
    })
    return reviews
  }
  return []
}

const isTagReview = (r: Review) => !!r.tag_id

export const useUserReview = (restaurantId: string) => {
  return useUserReviews(restaurantId).filter(
    (x) => !isTagReview(x) && !!x.text
  )[0]
}

export const useUserFavorite = (restaurantId: string) => {
  return useUserReviews(restaurantId).filter(
    (x) => !isTagReview(x) && x.favorited
  )[0]
}

export const useUserUpvoteDownvote = (
  restaurantId: string,
  activeTagIds: HomeActiveTagIds
) => {
  const om = useOvermind()
  const userId = om.state.user.user?.id
  const votes = useUserTagVotes(restaurantId)
  const vote = getTagUpvoteDownvote(votes, activeTagIds)
  const [userVote, setUserVote] = useState<number | null>(null)
  return [
    userVote ?? vote,
    (rating: number) => {
      if (votes.length) {
        votes.forEach((vote) => {
          vote.rating = rating
          console.log('set rating', vote, rating)
        })
      } else {
        setUserVote(rating)
        reviewUpsert(
          Object.keys(activeTagIds)
            .filter((x) => activeTagIds[x])
            .map<Review>((tagId) => {
              return {
                tag_id: tagId,
                user_id: userId,
                restaurant_id: restaurantId,
                rating,
              }
            })
        )
      }
    },
  ] as const
}

const getTagUpvoteDownvote = (
  votes: Review[],
  activeTagIds: HomeActiveTagIds
): number => {
  const tagIdVotes = votes.filter((x) => activeTagIds[x.tag_id])
  if (tagIdVotes.length === 0) {
    return 0
  }
  if ([...new Set(tagIdVotes.map((x) => x.rating))].length !== 1) {
    // mistmatched votes
    console.warn('mistmatched votes across tags?')
    return 0
  }
  return +(tagIdVotes[0].rating ?? 0)
}

export const useUserTagVotes = (restaurantId: string) => {
  return useUserReviews(restaurantId).filter(isTagReview)
}

export const useUserTagVotesByTagId = (restaurantId: string) => {
  const votes = useUserTagVotes(restaurantId)
  return votes.reduce((acc, vote) => {
    return {
      ...acc,
      [vote.tag_id]: vote,
    }
  }, {})
}

function draft<A>(item: A) {
  return item
}
