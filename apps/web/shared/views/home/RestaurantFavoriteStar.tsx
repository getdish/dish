import { graphql } from '@dish/graph'
import { Text, Toast, VStack, useForceUpdate } from '@dish/ui'
import React, { memo, useState } from 'react'
import { Star } from 'react-feather'

import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../ui/LinkButton'
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
      const forceUpdate = useForceUpdate()
      const review = useUserReview(restaurantId)
      const isStarred = review?.rating > 0

      const persist = async () => {
        Toast.show('Saved')
      }

      const setRating = (r: number) => {
        if (!review) return
        if (!om.actions.user.ensureLoggedIn()) {
          return
        }
        review.rating = r
        review.restaurant_id = restaurantId
        persist()
        forceUpdate()
      }

      return (
        <LinkButton
          hoverStyle={{ opacity: 0.5 }}
          pressStyle={{ opacity: 0.2 }}
          onPress={() => setRating(isStarred ? 0 : 1)}
        >
          <VStack
            marginTop={2}
            width={sizePx}
            height={sizePx}
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
        </LinkButton>
      )
    }
  )
)
