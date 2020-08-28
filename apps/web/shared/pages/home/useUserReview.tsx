import { series, sleep } from '@dish/async'
import { Review, query, refetch, resolved, reviewUpsert } from '@dish/graph'
import { Toast, useForceUpdate } from '@dish/ui'
import { useEffect, useState } from 'react'

import { getTagId } from '../../state/getTagId'
import { getFullTags } from '../../state/home-tag-helpers'
import { HomeActiveTagsRecord } from '../../state/home-types'
import { omStatic, useOvermind } from '../../state/om'

type ReviewWithTag = Pick<
  Review,
  | 'id'
  | 'rating'
  | 'tag_id'
  | 'text'
  | 'restaurant_id'
  | 'user_id'
  | 'favorited'
> & {
  tag?: {
    name: string
    type: string
  }
}

export const useUserReviewsQuery = (
  restaurantId: string,
  refetchKey?: string
) => {
  const om = useOvermind()
  const forceUpdate = useForceUpdate()
  const userId = (om.state.user.user?.id as string) ?? ''

  const shouldFetch = userId && restaurantId
  const reviews = shouldFetch
    ? query
        .review({
          where: {
            restaurant_id: {
              _eq: restaurantId,
            },
            user_id: {
              _eq: userId,
            },
          },
        })
        .map<ReviewWithTag>((review) => {
          let tag = null
          if (review.tag_id) {
            const tagQuery = query.tag({
              where: { id: { _eq: review.tag_id } },
            })[0]
            tag = {
              name: tagQuery?.name,
              type: tagQuery?.type,
            }
          }
          return {
            id: review.id,
            rating: review.rating,
            tag_id: review.tag_id,
            text: review.text,
            tag,
            restaurant_id: review.restaurant_id,
            user_id: review.user_id,
            favorited: review.favorited,
          }
        })
    : []

  // ensure fetched by gqless

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
  const [_, reviews] = useUserReviewsQuery(restaurantId)
  return reviews.filter((x) => !isTagReview(x) && !!x.text)[0]
}

export const useUserFavorite = (restaurantId: string) => {
  const [key, setKey] = useState('')
  const [_, reviews] = useUserReviewsQuery(restaurantId, key)
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

const getTagUpvoteDownvote = (
  votes: ReviewWithTag[],
  activeTags: HomeActiveTagsRecord
): number => {
  const tagIdVotes = votes.filter((x) => activeTags[getTagId(x.tag)])
  console.log('what is', votes, activeTags, tagIdVotes)
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
    const tagId = fullTags.find((x) => x.name.toLowerCase() === name)?.id
    if (!tagId) {
      console.warn({ name, tagNames, partialTags, fullTags })
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

export const useUserTagVotes = (restaurantId: string) => {
  const [userId, reviews, om] = useUserReviewsQuery(restaurantId)
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
