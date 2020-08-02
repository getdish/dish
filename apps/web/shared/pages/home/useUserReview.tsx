import { series, sleep } from '@dish/async'
import { Review, query, refetch, resolved, reviewUpsert } from '@dish/graph'
import { Toast, useForceUpdate } from '@dish/ui'
import { useEffect, useState } from 'react'

import { getTagId } from '../../state/getTagId'
import { getFullTags } from '../../state/home-tag-helpers'
import { HomeActiveTagsRecord } from '../../state/home-types'
import { omStatic, useOvermind } from '../../state/useOvermind'

export const useUserReviews = (restaurantId: string, refetchKey?: string) => {
  const om = useOvermind()
  const forceUpdate = useForceUpdate()
  const userId = (om.state.user.user?.id as string) ?? ''

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

  return [userId, reviews, om] as const
}

const isTagReview = (r: Review) => !!r.tag_id

export const useUserReview = (restaurantId: string) => {
  return useUserReviews(restaurantId).filter(
    (x) => !isTagReview(x) && !!x.text
  )[0]
}

export const useUserFavorite = (restaurantId: string) => {
  const [key, setKey] = useState('')
  const [_, reviews] = useUserReviews(restaurantId, key)
  const review = reviews.filter((x) => !isTagReview(x) && x.favorited)[0]
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
  activeTags: HomeActiveTagsRecord
) => {
  const om = useOvermind()
  const userId = om.state.user.user?.id
  const [votes] = useUserTagVotes(restaurantId)
  const vote = getTagUpvoteDownvote(votes, activeTags)
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
        })
      } else {
        setUserVote(rating)
        const tagsList = Object.keys(activeTags).filter((x) => activeTags[x])
        const saved = await voteForTags(restaurantId, userId, tagsList, rating)
        if (saved.length) {
          Toast.show(`Saved`)
        }
      }
    },
  ] as const
}

const voteForTags = async (
  restaurantId: string,
  userId: string,
  tagNames: string[],
  rating: number
) => {
  const partialTags = tagNames.map((name) => ({
    type: 'dish',
    ...omStatic.state.home.allTags[name],
    name,
  }))
  const fullTags = await getFullTags(partialTags)
  const insertTags = tagNames.map<Review>((name) => {
    const tagId = fullTags.find((x) => x.name === name)?.id
    if (!tagId) {
      throw new Error('no tag')
    }
    return {
      tag_id: tagId,
      user_id: userId,
      restaurant_id: restaurantId,
      rating,
    }
  })
  if (insertTags.length) {
    return await reviewUpsert(insertTags)
  }
}

const getTagUpvoteDownvote = (
  votes: Review[],
  activeTags: HomeActiveTagsRecord
): number => {
  const tagIdVotes = votes.filter((x) => activeTags[x.tag_id])
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
  const [userId, reviews, om] = useUserReviews(restaurantId)
  const votes = reviews.filter(isTagReview)
  const upVotes = votes.filter((x) => x.rating)
  return [
    upVotes,
    async (tagName: string, userRating: number | 'toggle') => {
      if (omStatic.actions.home.promptLogin()) {
        return
      }
      const tagId = getTagId({ name: tagName, type: 'lense' })
      const id = om.state.home.allTags[tagId]?.id
      const existing = votes.find((x) => x.tag_id === id)
      let didSave = !!existing
      if (existing) {
        // optimistic
        existing.rating = userRating == 'toggle' ? !existing.rating : userRating
      } else {
        // delayed
        const saved = await voteForTags(
          restaurantId,
          userId,
          [tagName],
          userRating === 'toggle' ? 1 : userRating
        )
        didSave = !!saved.length
        if (didSave) {
          sleep(200).then(() => {
            refetch(reviews)
          })
        }
      }
      if (didSave) {
        Toast.show(`Saved`)
      }
    },
  ] as const
}
