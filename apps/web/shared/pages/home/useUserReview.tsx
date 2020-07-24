import { series, sleep } from '@dish/async'
import { Review, query, refetch, reviewUpsert } from '@dish/graph'
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
  // if (userId && !restaurantId) {
  //   console.log('no restaurantId')
  // }

  let reviews = []

  const shouldFetch = userId && restaurantId
  if (shouldFetch) {
    reviews = query.review({
      where: {
        restaurant_id: {
          _eq: restaurantId,
        },
        user_id: {
          _eq: userId,
        },
      },
    })
  }

  useEffect(() => {
    if (refetchKey && shouldFetch) {
      console.log('refetching')
      refetch(reviews)
      return series([
        () => sleep(250),
        () => {
          forceUpdate()
        },
      ])
    }
  }, [refetchKey])

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
  const [optimistic, setOptimistic] = useState(null)
  const isStarred = optimistic ?? review?.favorited
  return [
    isStarred,
    (next: boolean) => {
      const user = omStatic.state.user.user
      if (!user) {
        return
      }
      if (!review) {
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
      } else {
        review.favorited = next
      }
      setOptimistic(next)
      Toast.show(next ? 'Favorited' : 'Un-favorited')
    },
  ] as const
}

export const useUserUpvoteDownvote = (
  restaurantId: string,
  tags: HomeActiveTagIds
) => {
  const om = useOvermind()
  const userId = om.state.user.user?.id
  const votes = useUserTagVotes(restaurantId)
  const vote = getTagUpvoteDownvote(votes, tags)
  const [userVote, setUserVote] = useState<number | null>(null)
  return [
    userVote ?? vote,
    async (rating: number) => {
      if (votes.length) {
        votes.forEach((vote) => {
          vote.rating = rating
          console.log('set rating', vote, rating)
        })
      } else {
        setUserVote(rating)
        const activeTagIds = Object.keys(tags).filter((x) => tags[x])
        const partialTags = activeTagIds.map((id) => ({
          ...omStatic.state.home.allTags[id],
          name,
        }))
        const fullTags = await getFullTags(partialTags)
        const insertTags = activeTagIds
          .map<Review>((name) => {
            const tagId = fullTags.find((x) => x.name === name)?.id
            if (!tagId) {
              console.warn('no tag', name, tagId, fullTags, activeTagIds)
              return null
            }
            return {
              tag_id: tagId,
              user_id: userId,
              restaurant_id: restaurantId,
              rating,
            }
          })
          .filter(Boolean)
        console.log('fullTags', partialTags, fullTags, insertTags)
        if (insertTags.length) {
          reviewUpsert(insertTags).then((res) => {
            if (res.length) {
              Toast.show(`Voted`)
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

function draft<A>(item: A) {
  return item
}
