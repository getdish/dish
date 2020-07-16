import { graphql, reviewInsert } from '@dish/graph'
import { HStack, Text, Toast, VStack } from '@dish/ui'
import React, { memo, useState } from 'react'
import { Star } from 'react-feather'

import { useOvermind } from '../../state/useOvermind'
import { useUserReview } from './useUserReview'

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
      const review = useUserReview(restaurantId)
      const [optimisticRating, setOptimisticRating] = useState(0)
      const isStarred = (optimisticRating ?? review?.rating) > 0

      const setRating = (r: number) => {
        const user = om.state.user.user
        if (!user) {
          return
        }
        if (!review) {
          reviewInsert([
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
        Toast.show(r ? 'Added favorite' : 'Removed favorite')
      }

      return (
        <HStack
          hoverStyle={{ opacity: 0.5 }}
          pressStyle={{ opacity: 0.4 }}
          pointerEvents="auto"
          onPress={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setRating(isStarred ? 0 : 1)
          }}
        >
          <VStack
            hoverStyle={{
              backgroundColor: '#fff',
            }}
            padding={4}
            borderRadius={100}
            overflow="hidden"
          >
            {isStarred && (
              <Text
                fontSize={sizePx * 0.88}
                lineHeight={sizePx * 0.88}
                marginTop={3}
                marginLeft={2}
              >
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
