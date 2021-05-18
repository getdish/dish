import {
  client,
  globalTagId,
  query,
  refetch,
  resolved,
  review,
  reviewInsert,
  reviewUpsert,
  review_constraint,
} from '@dish/graph'
import { useEffect, useState } from 'react'
import { Toast, useGet } from 'snackui'

import { getColorsForName } from '../../../helpers/getColorsForName'
import { queryList } from '../../../queries/queryList'
import { getListColor } from '../../home/list/listColors'
import { useUserStore, userStore } from '../../userStore'
import { ListIDProps } from './ListCard'

export const useList = ({ slug }: ListIDProps) => {
  const [list] = slug ? queryList(slug) : []
  const colors = getColorsForName(list?.name ?? '')
  const photos = list
    ?.restaurants({
      limit: 4,
      where: {
        restaurant: {
          image: {
            _neq: null,
          },
        },
      },
    })
    .map((x) => x.restaurant.image)

  const backgroundColor = getListColor(list?.color) ?? colors.color

  return { list, colors, photos, backgroundColor }
}

export const useListFavorite = ({ slug }: ListIDProps) => {
  const [list] = slug ? queryList(slug) : []
  const listId = list?.id
  const { user } = useUserStore()
  const userId = user?.id
  const [isFavorited, setIsFavorited] = useState(false)
  const reviewsCountOG =
    list
      ?.list_reviews_aggregate({
        where: {
          favorited: {
            _eq: true,
          },
        },
      })
      .aggregate?.count() || 0
  const reviewsCount = reviewsCountOG + (isFavorited ? 1 : 0)
  const reviewQ = userId
    ? list?.list_reviews({
        where: {
          type: {
            _eq: 'favorite',
          },
          user_id: {
            _eq: userId,
          },
          favorited: {
            _eq: true,
          },
        },
      })
    : null
  const review = reviewQ?.[0]
  const reviewId = review?.id
  console.log('review', userId, review?.id, review?.favorited)
  const getId = useGet(reviewId)
  const isFavoritedCurrent = review?.favorited ?? false

  useEffect(() => {
    setIsFavorited(isFavoritedCurrent)
  }, [isFavoritedCurrent])

  const toggleFavorite = async () => {
    if (userStore.promptLogin()) {
      return false
    }
    const favorited = !isFavorited
    const id = getId()
    const next = {
      user_id: userId,
      type: 'favorite',
      list_id: listId,
      favorited,
    }
    setIsFavorited(favorited)
    if (!id) {
      await reviewInsert([next])
    } else {
      const response = await reviewUpsert([next], review_constraint.review_type_user_id_list_id_key)
      if (!response) {
        console.error('response', response)
        Toast.show('Error saving')
        return false
      }
    }
    // fixes slow speed bug
    client.cache = {}

    Toast.show(`Saved`)
  }

  return { list, isFavorited, toggleFavorite, reviewsCount }
}
