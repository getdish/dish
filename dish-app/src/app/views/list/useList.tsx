import { client, query, resolved, reviewUpsert, review_constraint } from '@dish/graph'
import { useEffect, useState } from 'react'
import { Toast } from 'snackui'

import { getColorsForName } from '../../../helpers/getColorsForName'
import { queryList } from '../../../queries/queryList'
import { getListColor } from '../../home/list/listColors'
import { useUserStore, userStore } from '../../userStore'
import { ListIDProps } from './ListCard'

export const useList = ({ slug }: ListIDProps) => {
  const [list] = slug ? queryList(slug) : []
  const listId = list?.id
  const userId = userStore.user?.id
  const [isFavorited, setIsFavorited] = useState(false)
  const { user } = useUserStore()
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
  const isFavoritedCurrent = userId
    ? list?.list_reviews({
        where: {
          user_id: {
            _eq: userId,
          },
          favorited: {
            _eq: true,
          },
        },
      })[0]?.favorited || false
    : false

  useEffect(() => {
    setIsFavorited(isFavoritedCurrent)
  }, [isFavoritedCurrent])

  const toggleFavorite = async () => {
    if (userStore.promptLogin()) {
      return false
    }
    const review = await resolved(
      () =>
        query
          .review({
            limit: 1,
            where: {
              list_id: {
                _eq: listId,
              },
              user_id: {
                _eq: userId,
              },
            },
          })
          .map((review) => ({
            id: review?.id,
            favorited: review?.favorited,
          }))[0]
    )
    const favorited = !review?.favorited
    const next = {
      id: review?.id,
      user_id: userId,
      type: 'favorite',
      list_id: listId,
      favorited,
    }
    setIsFavorited(favorited)
    // fixes slow speed bug
    client.cache = {}
    const response = await reviewUpsert([next], review_constraint.review_pkey)
    if (!response) {
      console.error('response', response)
      Toast.show('Error saving')
      return false
    }
    Toast.show(`Saved`)
  }

  return { list, isFavorited, toggleFavorite, reviewsCount, colors, photos, backgroundColor }
}
