import { series, sleep } from '@dish/async'
import { Review, query, refetch, resolved, reviewUpsert } from '@dish/graph'
import { Toast, useForceUpdate } from '@dish/ui'
import { useEffect, useState } from 'react'

import { HomeActiveTagIds } from '../../state/home'
import { getFullTags } from '../../state/home-tag-helpers'
import { omStatic, useOvermind } from '../../state/useOvermind'

export const useUserReviews = (
  restaurantId: string,
  refetchKey?: string
): Review[] => {
  const om = useOvermind()
  const forceUpdate = useForceUpdate()
  const userId = om.state.user.user?.id

  const shouldFetch = userId && restaurantId
  const reviews = shouldFetch
    ? query.review({
        where: {
          restaurant_id: {
            _eq: restaurantId,
          },
          user_id: {
            _eq: userId,
          },
        },
      })
    : []

  useEffect(() => {
    if (refetchKey && shouldFetch) {
      const fetcher = refetch(reviews) as any
      if (fetcher) {
        return series([() => resolved(fetcher), forceUpdate])
      }
    }
  }, [reviews, refetchKey])

  return reviews
}

const isTagReview = (r: Review) => !!r.tag_id

export const useUserReview = (restaurantId: string) => {
  return useUserReviews(restaurantId).filter(
    (x) => !isTagReview(x) && !!x.text
  )[0]
}

export const useUserFavorite = (restaurantId: string) => {
  const [key, setKey] = useState('')
  const review = useUserReviews(restaurantId, key).filter(
    (x) => !isTagReview(x) && x.favorited
  )[0]
  const [optimistic, setOptimistic] = useState<boolean | null>(null)
  const isStarred = optimistic ?? review?.favorited
  return [
    isStarred,
    (next: boolean) => {
      if (omStatic.actions.home.promptLogin()) {
        return
      }
      const user = omStatic.state.user.user!
      reviewUpsert([
        {
          user_id: user.id,
          favorited: next,
          restaurant_id: restaurantId,
        },
      ]).then((res) => {
        setKey(`${Math.random()}`)
        if (!res?.length) {
          Toast.show('Error saving')
          return
        }
        console.log('favorited', res)
      })
      setOptimistic(next)
      Toast.show(next ? 'Favorited' : 'Un-favorited')
    },
  ] as const
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
    async (rating: number) => {
      if (omStatic.actions.home.promptLogin()) {
        return
      }

      if (votes.length) {
        votes.forEach((vote) => {
          vote.rating = rating
          console.log('set rating', vote, rating)
        })
      } else {
        setUserVote(rating)
        const activeTags = Object.keys(activeTagIds).filter(
          (x) => activeTagIds[x]
        )
        const partialTags = activeTags.map((name) => ({
          type: 'dish',
          ...omStatic.state.home.allTags[name],
          name,
        }))
        const fullTags = await getFullTags(partialTags)
        console.log('got', { partialTags, fullTags, activeTags })
        const insertTags = activeTags.map<Review>((name) => {
          const tagId = fullTags.find((x) => x.name === name)?.id
          if (!tagId) {
            console.warn('no tag', name, tagId, fullTags, activeTags)
            throw new Error('no tag')
          }
          return {
            tag_id: tagId,
            user_id: userId,
            restaurant_id: restaurantId,
            rating,
          }
        })
        console.log('fullTags', partialTags, fullTags, insertTags)
        if (insertTags.length) {
          reviewUpsert(insertTags).then((res) => {
            if (res.length) {
              Toast.show(`Saved`)
            }
          })
        }
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
