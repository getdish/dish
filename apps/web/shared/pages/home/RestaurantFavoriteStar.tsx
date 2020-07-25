import { graphql } from '@dish/graph'
import { HStack, Text, VStack, prevent } from '@dish/ui'
import React, { memo } from 'react'
import { Star } from 'react-feather'

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
      const [isFavorite, setIsFavorite] = useUserFavorite(restaurantId)

      return (
        <HStack
          pressStyle={{ opacity: 0.4 }}
          hoverStyle={{
            borderColor: '#aaa',
          }}
          pointerEvents="auto"
          // @ts-ignore
          userSelect="none"
          onPress={(e) => {
            prevent(e)
            setIsFavorite(!isFavorite)
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
            {isFavorite && (
              <Text fontSize={sizePx * 0.88} lineHeight={sizePx * 0.88}>
                ⭐️
              </Text>
            )}
            {!isFavorite && <Star size={sizePx} color={'#aaa'} />}
          </VStack>
        </HStack>
      )
    }
  )
)
