import { graphql, reviewInsert, reviewUpsert } from '@dish/graph'
import { HStack, Text, Toast, VStack } from '@dish/ui'
import React, { memo, useState } from 'react'
import { Star } from 'react-feather'

import { useOvermind } from '../../state/useOvermind'
import { useUserFavorite } from './useUserReview'

export const RestaurantFavoriteStar = memo(
  graphql(
    ({
      size = 'md',
      restaurantId,
    }: {
      isHovered?: boolean
      size?: 'lg' | 'md'
      restaurantId: string
    }) => {
      const sizePx = size == 'lg' ? 26 : 16
      const om = useOvermind()
      // const forceUpdate = useForceUpdate()
      const review = useUserFavorite(restaurantId)
      const [optimisticRating, setOptimisticRating] = useState(0)
      const isStarred = (optimisticRating ?? review?.rating) > 0

      const setRating = (r: number) => {
        const user = om.state.user.user
        if (!user) {
          return
        }
        if (!review) {
          reviewUpsert([
            {
              user_id: user.id,
              rating: r,
              restaurant_id: restaurantId,
            },
          ])
        } else {
          review.rating = r
        }
        setOptimisticRating(r)
        Toast.show(r ? 'Favorited' : 'Un-favorited')
      }

      return (
        <HStack
          pressStyle={{ opacity: 0.4 }}
          hoverStyle={{
            borderColor: '#999',
          }}
          pointerEvents="auto"
          // @ts-ignore
          userSelect="none"
          onPress={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setRating(isStarred ? 0 : 1)
          }}
          height={sizePx * 1.4}
          width={sizePx * 1.4}
          alignItems="center"
          justifyContent="center"
          backgroundColor="#fff"
          borderRadius={100}
          borderWidth={1}
          borderColor="#eee"
        >
          <VStack
            hoverStyle={{
              backgroundColor: '#fff',
            }}
            borderRadius={100}
            overflow="hidden"
          >
            {isStarred && (
              <Text fontSize={sizePx * 0.88} lineHeight={sizePx * 0.88}>
                ⭐️
              </Text>
            )}
            {!isStarred && <Star size={sizePx} color={'goldenrod'} />}
          </VStack>
        </HStack>
      )
    }
  )
)
