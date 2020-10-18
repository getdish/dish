import { Review, reviewUpsert } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { Store, useStore, useStoreSelector } from '@dish/use-store'
import { sleep } from '@o/async'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Toast, useGet } from 'snackui'

import { useIsMountedRef } from '../helpers/useIsMountedRef'
import { allTags } from '../state/allTags'
import { getFullTags } from '../state/getFullTags'
import { getTagId } from '../state/getTagId'
import { HomeActiveTagsRecord } from '../state/home-types'
import { NavigableTag } from '../state/NavigableTag'
import { useOvermind } from '../state/om'
import { omStatic } from '../state/omStatic'
import {
  ReviewWithTag,
  isTagReview,
  useUserReviewsQuery,
} from './useUserReview'

export type VoteNumber = -1 | 0 | 1

class UserVotes extends Store<{ key: string }> {
  vote: VoteNumber = 0

  setVote(next: VoteNumber) {
    this.vote = next
  }
}

const setStoreVotes = (
  voteStores: { [key: string]: UserVotes },
  vote: VoteNumber
) => {
  for (const key in voteStores) {
    voteStores[key].setVote(vote)
  }
}

export const useUserUpvoteDownvoteQuery = (
  restaurantId: string,
  activeTags: HomeActiveTagsRecord
) => {
  const om = useOvermind()
  const userId = om.state.user.user?.id
  const [votes] = useUserTagVotes(restaurantId)
  const vote = getTagUpvoteDownvote(votes, activeTags)
  const tagKeyList = Object.keys(activeTags).filter((x) => activeTags[x])
  const getTagKeyList = useGet(tagKeyList)
  const voteStores = {}
  for (const key of tagKeyList) {
    voteStores[key] = useStore(UserVotes, { key: `${key}${restaurantId}` })
  }
  const userVote = voteStores[tagKeyList[0]]?.vote ?? 0

  useEffect(() => {
    setStoreVotes(voteStores, vote)
  }, [vote])

  const setVote = useCallback(async (vote: VoteNumber) => {
    if (omStatic.actions.home.promptLogin()) {
      return
    }
    setStoreVotes(voteStores, vote)
    const tagsList = getTagKeyList().map((id) => allTags[id])
    const saved = await voteForTags(restaurantId, userId, tagsList, vote)
    if (saved?.length) {
      Toast.show(`Saved`)
    }
  }, [])

  return {
    votes,
    vote: userVote ?? vote,
    setVote,
  }
}

const getTagUpvoteDownvote = (
  votes: ReviewWithTag[],
  activeTags: HomeActiveTagsRecord
): VoteNumber => {
  const tagIdVotes = votes
    .filter((x) => (x.tag ? activeTags[getTagId(x.tag)] : null))
    .filter(isPresent)
  if (tagIdVotes.length === 0) {
    return 0
  }
  if ([...new Set(tagIdVotes.map((x) => x.rating))].length !== 1) {
    // mistmatched votes
    console.warn('mistmatched votes across tags?')
    return 0
  }
  return +(tagIdVotes[0].rating ?? 0) as VoteNumber
}

const voteForTags = async (
  restaurantId: string,
  userId: string,
  tags: NavigableTag[],
  vote: VoteNumber
) => {
  const partialTags = tags.map((tag) => ({
    ...allTags[getTagId(tag)],
    ...tag,
  }))
  const fullTags = await getFullTags(partialTags)
  const insertTags = tags.map<Review>((tag) => {
    const tagId = fullTags.find(
      (x) => x.name?.toLowerCase() === tag.name?.toLowerCase()
    )?.id
    if (!tagId) {
      console.warn({ tags, partialTags, fullTags })
      throw new Error('no tag')
    }
    return {
      tag_id: tagId,
      user_id: userId,
      restaurant_id: restaurantId,
      vote,
      type: 'vote',
    }
  })
  if (insertTags.length) {
    console.log('inserting', insertTags)
    return await reviewUpsert(insertTags)
  } else {
    console.warn('no tags?')
  }
}

const toggleRating = (r: number) => (r == 1 ? -1 : 1)

export const useUserTagVotes = (restaurantId: string, tagId?: string) => {
  const isMounted = useIsMountedRef()
  const { userId, reviews, reviewsQuery, refetch } = useUserReviewsQuery(
    restaurantId,
    'vote'
  )
  const votes = reviews.filter((review) => {
    if (!isTagReview(review)) return false
    if (review.rating === 0) return false
    if (tagId && review.tag_id !== tagId) return false
    return true
  })
  return [
    votes,
    async (tag: NavigableTag, userVote: VoteNumber | 'toggle') => {
      if (omStatic.actions.home.promptLogin()) {
        return
      }
      const id = tagId ?? allTags[getTagId(tag)]?.id
      const existing = reviewsQuery.find((x) => x.tag_id === id)
      if (existing) {
        // optimistic
        existing.rating =
          userVote == 'toggle' ? toggleRating(existing.rating) : userVote
      }
      // delayed
      const saved = await voteForTags(
        restaurantId,
        userId,
        [tag],
        userVote === 'toggle' ? 1 : userVote
      )
      const didSave = !!saved?.length
      if (didSave) {
        Toast.show(`Saved`)
        sleep(350).then(() => {
          if (isMounted.current) {
            refetch()
          }
        })
      }
    },
  ] as const
}
