import { client, reviewUpsert, review_constraint, useRefetch } from '@dish/graph'
import { useEffect, useState } from 'react'
import { Toast } from 'snackui'

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
      limit: 2,
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

export const useListFavorite = ({ slug }: { slug: string }) => {
  const doRefetch = useRefetch()
  const listQuery = slug ? queryList(slug) : []
  const list = listQuery[0]
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
  const reviewQuery = userId
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
  const review = reviewQuery?.[0]
  const isFavoritedCurrent = review?.favorited ?? false

  useEffect(() => {
    setIsFavorited(isFavoritedCurrent)
  }, [isFavoritedCurrent])

  const toggleFavorite = async () => {
    if (userStore.promptLogin()) {
      return false
    }
    const favorited = !isFavorited
    const next = {
      user_id: userId,
      type: 'favorite',
      list_id: listId,
      favorited,
    }
    setIsFavorited(favorited)
    const response = await reviewUpsert([next], review_constraint.review_type_user_id_list_id_key)
    if (!response) {
      console.error('response', response)
      Toast.show('Error saving')
      return false
    }
    // fixes slow speed bug
    client.cache = {}

    Toast.show(`Saved`)
  }

  const refetch = () => {
    doRefetch(listQuery)
    doRefetch(reviewQuery)
  }

  return { refetch, list, isFavorited, toggleFavorite, reviewsCount }
}
